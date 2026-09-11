import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto";

import {
  EXECUTION_STRATEGY_PRODUCT_CODE,
} from "../execution-strategy-types";

const STRATEGY_ORDER_TOKEN_TTL_SECONDS =
  2 * 60 * 60;

const STRATEGY_GENERATION_TOKEN_TTL_SECONDS =
  30 * 60;

type StrategyTokenPurpose =
  | "strategy_order"
  | "strategy_generation";

export type VerifiedStrategyToken = {
  version: 1;

  purpose:
    StrategyTokenPurpose;

  productCode:
    typeof EXECUTION_STRATEGY_PRODUCT_CODE;

  paymentId: string;

  amount: number;

  strategyHash: string;

  issuedAt: number;

  expiresAt: number;
};

function getSigningSecret() {
  const secret =
    process.env
      .PAYMENT_TOKEN_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "PAYMENT_TOKEN_SECRET이 설정되지 않았습니다."
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "PAYMENT_TOKEN_SECRET은 최소 32자 이상이어야 합니다."
    );
  }

  return secret;
}

function stableSerialize(
  value: unknown
): string {
  if (value === null) {
    return "null";
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(
      value
    );
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(
        "유효하지 않은 숫자 값이 포함되어 있습니다."
      );
    }

    return JSON.stringify(
      value
    );
  }

  if (Array.isArray(value)) {
    return (
      "[" +
      value
        .map((item) =>
          stableSerialize(
            item
          )
        )
        .join(",") +
      "]"
    );
  }

  if (typeof value === "object") {
    const record =
      value as Record<
        string,
        unknown
      >;

    const keys =
      Object.keys(record)
        .filter(
          (key) =>
            record[key] !==
            undefined
        )
        .sort();

    return (
      "{" +
      keys
        .map(
          (key) =>
            `${JSON.stringify(
              key
            )}:${stableSerialize(
              record[key]
            )}`
        )
        .join(",") +
      "}"
    );
  }

  throw new Error(
    "지원하지 않는 데이터 형식이 포함되어 있습니다."
  );
}

export function hashExecutionStrategy(
  strategyPayload: unknown
) {
  const serialized =
    stableSerialize(
      strategyPayload
    );

  return createHash(
    "sha256"
  )
    .update(
      serialized,
      "utf8"
    )
    .digest(
      "base64url"
    );
}

function signPayload(
  payload:
    VerifiedStrategyToken
) {
  const encodedPayload =
    Buffer.from(
      JSON.stringify(
        payload
      ),
      "utf8"
    ).toString(
      "base64url"
    );

  const signature =
    createHmac(
      "sha256",
      getSigningSecret()
    )
      .update(
        encodedPayload,
        "utf8"
      )
      .digest(
        "base64url"
      );

  return `${encodedPayload}.${signature}`;
}

function verifyToken(
  token: string,
  expectedPurpose:
    StrategyTokenPurpose
): VerifiedStrategyToken | null {
  const parts =
    token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [
    encodedPayload,
    receivedSignature,
  ] = parts;

  if (
    !encodedPayload ||
    !receivedSignature
  ) {
    return null;
  }

  const expectedSignature =
    createHmac(
      "sha256",
      getSigningSecret()
    )
      .update(
        encodedPayload,
        "utf8"
      )
      .digest(
        "base64url"
      );

  const receivedBuffer =
    Buffer.from(
      receivedSignature,
      "utf8"
    );

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "utf8"
    );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return null;
  }

  if (
    !timingSafeEqual(
      receivedBuffer,
      expectedBuffer
    )
  ) {
    return null;
  }

  let payload:
    VerifiedStrategyToken;

  try {
    payload =
      JSON.parse(
        Buffer.from(
          encodedPayload,
          "base64url"
        ).toString(
          "utf8"
        )
      ) as VerifiedStrategyToken;
  } catch {
    return null;
  }

  if (
    payload.version !== 1 ||
    payload.purpose !==
      expectedPurpose ||
    payload.productCode !==
      EXECUTION_STRATEGY_PRODUCT_CODE ||
    typeof payload.paymentId !==
      "string" ||
    !payload.paymentId.startsWith(
      "WHYUNSOLD-STRATEGY-"
    ) ||
    payload.paymentId.length > 40 ||
    !Number.isInteger(
      payload.amount
    ) ||
    payload.amount <= 0 ||
    typeof payload.strategyHash !==
      "string" ||
    !payload.strategyHash ||
    typeof payload.issuedAt !==
      "number" ||
    typeof payload.expiresAt !==
      "number"
  ) {
    return null;
  }

  const now =
    Math.floor(
      Date.now() /
        1000
    );

  if (
    payload.expiresAt <
    now
  ) {
    return null;
  }

  return payload;
}

export function createStrategyOrderToken(
  paymentId: string,
  amount: number,
  strategyPayload: unknown
) {
  const now =
    Math.floor(
      Date.now() /
        1000
    );

  return signPayload({
    version: 1,

    purpose:
      "strategy_order",

    productCode:
      EXECUTION_STRATEGY_PRODUCT_CODE,

    paymentId,

    amount,

    strategyHash:
      hashExecutionStrategy(
        strategyPayload
      ),

    issuedAt:
      now,

    expiresAt:
      now +
      STRATEGY_ORDER_TOKEN_TTL_SECONDS,
  });
}

export function verifyStrategyOrderToken(
  token: string
) {
  return verifyToken(
    token,
    "strategy_order"
  );
}

export function createStrategyGenerationToken(
  paymentId: string,
  amount: number,
  strategyPayload: unknown
) {
  const now =
    Math.floor(
      Date.now() /
        1000
    );

  return signPayload({
    version: 1,

    purpose:
      "strategy_generation",

    productCode:
      EXECUTION_STRATEGY_PRODUCT_CODE,

    paymentId,

    amount,

    strategyHash:
      hashExecutionStrategy(
        strategyPayload
      ),

    issuedAt:
      now,

    expiresAt:
      now +
      STRATEGY_GENERATION_TOKEN_TTL_SECONDS,
  });
}

export function verifyStrategyGenerationToken(
  token: string
) {
  return verifyToken(
    token,
    "strategy_generation"
  );
}