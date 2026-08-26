import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  EXECUTION_STRATEGY_PRODUCT,
} from "../../../lib/execution-strategy-config";

import {
  createStrategyOrderToken,
} from "../../../lib/execution-strategy-security";

import {
  buildStrategyPurchasePayload,
  isDiagnosisForStrategy,
  isExecutionStrategyInput,
  validateExecutionStrategyConstraints,
} from "../../../lib/execution-strategy-validation";

type StrategyOrderTokenRequestBody = {
  paymentId?: unknown;

  amount?: unknown;

  diagnosis?: unknown;

  executionInput?: unknown;
};

function jsonError(
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
    }
  );
}

export async function POST(
  request: NextRequest
) {
  let body:
    StrategyOrderTokenRequestBody;

  try {
    body =
      (await request.json()) as
        StrategyOrderTokenRequestBody;
  } catch {
    return jsonError(
      "실행전략 주문 요청 형식이 올바르지 않습니다.",
      400
    );
  }

  const paymentId =
    typeof body.paymentId ===
      "string"
      ? body.paymentId.trim()
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

  const amount =
    typeof body.amount ===
      "number"
      ? body.amount
      : Number.NaN;

  if (
    !Number.isInteger(amount) ||
    amount !==
      EXECUTION_STRATEGY_PRODUCT
        .price
  ) {
    return jsonError(
      "실행전략 결제 금액이 올바르지 않습니다.",
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

  const constraintError =
    validateExecutionStrategyConstraints(
      body.diagnosis,
      body.executionInput
    );

  if (constraintError) {
    return jsonError(
      constraintError,
      400
    );
  }

  const strategyPayload =
    buildStrategyPurchasePayload(
      body.diagnosis,
      body.executionInput
    );

  try {
    const orderToken =
      createStrategyOrderToken(
        paymentId,
        EXECUTION_STRATEGY_PRODUCT
          .price,
        strategyPayload
      );

    return NextResponse.json({
      ok: true,

      productCode:
        EXECUTION_STRATEGY_PRODUCT
          .code,

      orderToken,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "실행전략 주문 토큰을 생성하지 못했습니다.";

    console.error(
      "[payment/strategy-order-token]",
      error
    );

    return jsonError(
      message,
      500
    );
  }
}