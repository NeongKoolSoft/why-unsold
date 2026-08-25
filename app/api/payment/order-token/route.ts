import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createOrderToken,
} from "../../../lib/payment-security";

const REPORT_PRICE = 20000;

type OrderTokenRequestBody = {
  paymentId?: unknown;
  amount?: unknown;
  diagnosis?: unknown;
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
  let body: OrderTokenRequestBody;

  try {
    body =
      (await request.json()) as OrderTokenRequestBody;
  } catch {
    return jsonError(
      "주문 요청 형식이 올바르지 않습니다.",
      400
    );
  }

  const paymentId =
    typeof body.paymentId === "string"
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
      "WHYUNSOLD"
    )
  ) {
    return jsonError(
      "올바르지 않은 결제번호입니다.",
      400
    );
  }

  if (
    paymentId.length > 40
  ) {
    return jsonError(
      "결제번호 길이가 올바르지 않습니다.",
      400
    );
  }

  const amount =
    typeof body.amount === "number"
      ? body.amount
      : Number.NaN;

  if (
    !Number.isFinite(amount) ||
    amount !== REPORT_PRICE
  ) {
    return jsonError(
      "결제 금액이 올바르지 않습니다.",
      400
    );
  }

  if (
    !body.diagnosis ||
    typeof body.diagnosis !==
      "object" ||
    Array.isArray(
      body.diagnosis
    )
  ) {
    return jsonError(
      "분석 정보를 확인해주세요.",
      400
    );
  }

  try {
    const orderToken =
      createOrderToken(
        paymentId,
        REPORT_PRICE,
        body.diagnosis
      );

    return NextResponse.json({
      ok: true,
      orderToken,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "주문 토큰을 생성하지 못했습니다.";

    console.error(
      "[payment/order-token]",
      error
    );

    return jsonError(
      message,
      500
    );
  }
}