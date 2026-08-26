import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  EXECUTION_STRATEGY_PRODUCT,
} from "../../../lib/execution-strategy-config";

import {
  createStrategyGenerationToken,
  hashExecutionStrategy,
  verifyStrategyOrderToken,
} from "../../../lib/execution-strategy-security";

import {
  buildStrategyPurchasePayload,
  isDiagnosisForStrategy,
  isExecutionStrategyInput,
  validateExecutionStrategyConstraints,
} from "../../../lib/execution-strategy-validation";

const PORTONE_API_BASE =
  "https://api.portone.io";

type StrategyConfirmRequestBody = {
  paymentId?: unknown;

  orderToken?: unknown;

  diagnosis?: unknown;

  executionInput?: unknown;
};

type PortOnePayment = {
  status?: string;

  id?: string;

  transactionId?: string;

  merchantId?: string;

  storeId?: string;

  amount?: {
    total?: number;

    taxFree?: number;

    vat?: number;
  };

  currency?: string;

  orderName?: string;

  paidAt?: string | null;

  paymentMethod?: {
    type?: string;
  };
};

type PortOneErrorResponse = {
  type?: string;

  message?: string;
};

function jsonError(
  message: string,
  status: number,
  detail?: string
) {
  return NextResponse.json(
    {
      error: message,

      ...(detail
        ? {
            detail,
          }
        : {}),
    },
    {
      status,
    }
  );
}

export async function POST(
  request: NextRequest
) {
  const apiSecret =
    process.env
      .PORTONE_API_SECRET?.trim();

  const expectedStoreId =
    process.env
      .NEXT_PUBLIC_PORTONE_STORE_ID?.trim();

  if (!apiSecret) {
    return jsonError(
      "포트원 API Secret이 설정되지 않았습니다.",
      500
    );
  }

  if (!expectedStoreId) {
    return jsonError(
      "포트원 Store ID가 설정되지 않았습니다.",
      500
    );
  }

  let body:
    StrategyConfirmRequestBody;

  try {
    body =
      (await request.json()) as
        StrategyConfirmRequestBody;
  } catch {
    return jsonError(
      "실행전략 결제 확인 요청 형식이 올바르지 않습니다.",
      400
    );
  }

  const paymentId =
    typeof body.paymentId ===
      "string"
      ? body.paymentId.trim()
      : "";

  const orderToken =
    typeof body.orderToken ===
      "string"
      ? body.orderToken.trim()
      : "";

  if (!paymentId) {
    return jsonError(
      "paymentId를 확인해주세요.",
      400
    );
  }

  if (
    !paymentId.startsWith(
      EXECUTION_STRATEGY_PRODUCT
        .paymentPrefix
    ) ||
    paymentId.length > 40
  ) {
    return jsonError(
      "올바르지 않은 실행전략 결제번호입니다.",
      400
    );
  }

  if (!orderToken) {
    return jsonError(
      "실행전략 주문 보안정보를 확인할 수 없습니다.",
      400
    );
  }

  if (
    !isDiagnosisForStrategy(
      body.diagnosis
    )
  ) {
    return jsonError(
      "결제가 완료된 매도진단 결과가 필요합니다.",
      400
    );
  }

  if (
    !isExecutionStrategyInput(
      body.executionInput
    )
  ) {
    return jsonError(
      "실행전략 입력 정보를 확인해주세요.",
      400
    );
  }

  const diagnosis =
    body.diagnosis;

  const executionInput =
    body.executionInput;

  const constraintError =
    validateExecutionStrategyConstraints(
      diagnosis,
      executionInput
    );

  if (constraintError) {
    return jsonError(
      constraintError,
      400
    );
  }

  const strategyPayload =
    buildStrategyPurchasePayload(
      diagnosis,
      executionInput
    );

  let verifiedOrder;

  try {
    verifiedOrder =
      verifyStrategyOrderToken(
        orderToken
      );
  } catch (error) {
    console.error(
      "[payment/strategy-confirm] order token verification error",
      error
    );

    return jsonError(
      "실행전략 주문 보안정보를 검증하지 못했습니다.",
      500
    );
  }

  if (!verifiedOrder) {
    return jsonError(
      "실행전략 주문 보안정보가 올바르지 않거나 만료되었습니다.",
      409
    );
  }

  if (
    verifiedOrder.paymentId !==
      paymentId
  ) {
    return jsonError(
      "실행전략 주문 결제번호가 일치하지 않습니다.",
      409
    );
  }

  if (
    verifiedOrder.amount !==
      EXECUTION_STRATEGY_PRODUCT
        .price
  ) {
    return jsonError(
      "실행전략 주문 금액이 올바르지 않습니다.",
      409
    );
  }

  let strategyHash: string;

  try {
    strategyHash =
      hashExecutionStrategy(
        strategyPayload
      );
  } catch {
    return jsonError(
      "실행전략 정보의 형식이 올바르지 않습니다.",
      400
    );
  }

  if (
    verifiedOrder.strategyHash !==
      strategyHash
  ) {
    return jsonError(
      "결제 당시 실행전략 정보와 현재 정보가 일치하지 않습니다.",
      409
    );
  }

  let portOneResponse:
    Response;

  try {
    portOneResponse =
      await fetch(
        `${PORTONE_API_BASE}/payments/${encodeURIComponent(
          paymentId
        )}`,
        {
          method:
            "GET",

          headers: {
            Authorization:
              `PortOne ${apiSecret}`,
          },

          cache:
            "no-store",
        }
      );
  } catch {
    return jsonError(
      "포트원 결제 조회 서버에 연결하지 못했습니다.",
      502
    );
  }

  let responseBody:
    | PortOnePayment
    | PortOneErrorResponse
    | null = null;

  try {
    responseBody =
      (await portOneResponse.json()) as
        | PortOnePayment
        | PortOneErrorResponse;
  } catch {
    return jsonError(
      "포트원 결제 조회 응답을 처리하지 못했습니다.",
      502
    );
  }

  if (!portOneResponse.ok) {
    const error =
      responseBody as
        PortOneErrorResponse;

    return jsonError(
      "실행전략 결제 정보를 확인하지 못했습니다.",
      portOneResponse.status,
      error.message ||
        error.type ||
        "포트원 결제 조회 오류가 발생했습니다."
    );
  }

  const payment =
    responseBody as
      PortOnePayment;

  if (
    !payment.id ||
    payment.id !==
      paymentId
  ) {
    return jsonError(
      "조회된 실행전략 결제번호가 요청 정보와 일치하지 않습니다.",
      409
    );
  }

  if (
    !payment.storeId ||
    payment.storeId !==
      expectedStoreId
  ) {
    return jsonError(
      "조회된 결제의 상점 정보가 일치하지 않습니다.",
      409
    );
  }

  if (
    payment.amount?.total !==
      EXECUTION_STRATEGY_PRODUCT
        .price
  ) {
    return jsonError(
      "실행전략 결제 금액이 올바르지 않습니다.",
      409,
      `확인된 결제 금액: ${
        payment.amount?.total ??
        "UNKNOWN"
      }`
    );
  }

  if (
    payment.currency !==
      "KRW"
  ) {
    return jsonError(
      "실행전략 결제 통화가 올바르지 않습니다.",
      409,
      `확인된 결제 통화: ${
        payment.currency ??
        "UNKNOWN"
      }`
    );
  }

  if (
    payment.status !==
      "PAID"
  ) {
    return jsonError(
      "실행전략 결제가 정상적으로 완료되지 않았습니다.",
      409,
      `결제 상태: ${
        payment.status ??
        "UNKNOWN"
      }`
    );
  }

  let strategyToken:
    string;

  try {
    strategyToken =
      createStrategyGenerationToken(
        paymentId,
        EXECUTION_STRATEGY_PRODUCT
          .price,
        strategyPayload
      );
  } catch (error) {
    console.error(
      "[payment/strategy-confirm] generation token creation error",
      error
    );

    return jsonError(
      "실행전략 생성 보안정보를 만들지 못했습니다.",
      500
    );
  }

  return NextResponse.json({
    ok: true,

    strategyToken,

    payment: {
      paymentId:
        payment.id,

      transactionId:
        payment.transactionId ??
        null,

      status:
        payment.status,

      totalAmount:
        payment.amount.total,

      currency:
        payment.currency,

      method:
        payment.paymentMethod
          ?.type ??
        null,

      paidAt:
        payment.paidAt ??
        null,
    },
  });
}