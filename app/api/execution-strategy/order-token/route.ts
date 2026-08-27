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

type StrategyOrderTokenRequest = {
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
    StrategyOrderTokenRequest;

  try {
    body =
      (await request.json()) as
        StrategyOrderTokenRequest;
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

  const amount =
    typeof body.amount ===
      "number"
      ? body.amount
      : Number.NaN;

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

  if (
    !Number.isInteger(amount) ||
    amount !==
      EXECUTION_STRATEGY_PRODUCT
        .price
  ) {
    return jsonError(
      "실행전략 주문 금액이 올바르지 않습니다.",
      400
    );
  }

  if (
    !isDiagnosisForStrategy(
      body.diagnosis
    )
  ) {
    return jsonError(
      "매도진단 정보를 확인할 수 없습니다.",
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

  let orderToken: string;

  try {
    orderToken =
      createStrategyOrderToken(
        paymentId,
        amount,
        strategyPayload
      );
  } catch (error) {
    console.error(
      "[execution-strategy/order-token] token creation error",
      error
    );

    return jsonError(
      "실행전략 주문 보안정보를 생성하지 못했습니다.",
      500
    );
  }

  return NextResponse.json({
    ok: true,

    orderToken,

    order: {
      paymentId,

      amount,

      productCode:
        EXECUTION_STRATEGY_PRODUCT
          .code,

      orderName:
        EXECUTION_STRATEGY_PRODUCT
          .orderName,
    },
  });
}