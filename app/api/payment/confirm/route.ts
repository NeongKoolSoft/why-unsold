import { NextRequest, NextResponse } from "next/server";

const TOSS_CONFIRM_URL =
  "https://api.tosspayments.com/v1/payments/confirm";

const REPORT_PRICE = 20000;

type ConfirmRequestBody = {
  paymentKey?: unknown;
  orderId?: unknown;
  amount?: unknown;
};

type TossPaymentResponse = {
  paymentKey?: string;
  orderId?: string;
  status?: string;
  totalAmount?: number;
  method?: string | null;
  approvedAt?: string | null;
  code?: string;
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
        ? { detail }
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
  const secretKey =
    process.env.TOSS_SECRET_KEY;

  if (!secretKey) {
    return jsonError(
      "토스페이먼츠 시크릿 키가 설정되지 않았습니다.",
      500
    );
  }

  let body: ConfirmRequestBody;

  try {
    body =
      (await request.json()) as ConfirmRequestBody;
  } catch {
    return jsonError(
      "결제 승인 요청 형식이 올바르지 않습니다.",
      400
    );
  }

  const paymentKey =
    typeof body.paymentKey ===
    "string"
      ? body.paymentKey.trim()
      : "";

  const orderId =
    typeof body.orderId ===
    "string"
      ? body.orderId.trim()
      : "";

  const amount =
    typeof body.amount ===
    "number"
      ? body.amount
      : Number(body.amount);

  if (
    !paymentKey ||
    !orderId ||
    !Number.isFinite(amount)
  ) {
    return jsonError(
      "paymentKey, orderId, amount를 확인해주세요.",
      400
    );
  }

  if (
    !orderId.startsWith(
      "WHYUNSOLD-"
    )
  ) {
    return jsonError(
      "올바르지 않은 주문번호입니다.",
      400
    );
  }

  if (
    amount !== REPORT_PRICE
  ) {
    return jsonError(
      "결제 금액이 올바르지 않습니다.",
      400
    );
  }

  const encodedSecretKey =
    Buffer.from(
      `${secretKey}:`
    ).toString("base64");

  let tossResponse: Response;

  try {
    tossResponse =
      await fetch(
        TOSS_CONFIRM_URL,
        {
          method: "POST",
          headers: {
            Authorization:
              `Basic ${encodedSecretKey}`,
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              paymentKey,
              orderId,
              amount,
            }),
          cache: "no-store",
        }
      );
  } catch {
    return jsonError(
      "토스페이먼츠 결제 승인 서버에 연결하지 못했습니다.",
      502
    );
  }

  let payment:
    | TossPaymentResponse
    | null = null;

  try {
    payment =
      (await tossResponse.json()) as TossPaymentResponse;
  } catch {
    return jsonError(
      "토스페이먼츠 응답을 처리하지 못했습니다.",
      502
    );
  }

  if (!tossResponse.ok) {
    return jsonError(
      "결제 승인에 실패했습니다.",
      tossResponse.status,
      payment.message ||
        payment.code ||
        "토스페이먼츠 승인 오류가 발생했습니다."
    );
  }

  if (
    payment.orderId !==
      orderId ||
    payment.paymentKey !==
      paymentKey ||
    payment.totalAmount !==
      REPORT_PRICE
  ) {
    return jsonError(
      "승인된 결제 정보가 주문 정보와 일치하지 않습니다.",
      409
    );
  }

  if (
    payment.status !== "DONE"
  ) {
    return jsonError(
      "결제가 정상적으로 완료되지 않았습니다.",
      409,
      `결제 상태: ${
        payment.status ??
        "UNKNOWN"
      }`
    );
  }

  return NextResponse.json({
    ok: true,
    payment: {
      paymentKey:
        payment.paymentKey,
      orderId:
        payment.orderId,
      status:
        payment.status,
      totalAmount:
        payment.totalAmount,
      method:
        payment.method ??
        null,
      approvedAt:
        payment.approvedAt ??
        null,
    },
  });
}