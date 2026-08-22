import {
  NextRequest,
  NextResponse,
} from "next/server";

const PORTONE_API_BASE =
  "https://api.portone.io";

const REPORT_PRICE = 20000;

type ConfirmRequestBody = {
  paymentId?: unknown;
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
  const apiSecret =
    process.env.PORTONE_API_SECRET?.trim();

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

  let body: ConfirmRequestBody;

  try {
    body =
      (await request.json()) as ConfirmRequestBody;
  } catch {
    return jsonError(
      "결제 확인 요청 형식이 올바르지 않습니다.",
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
      "WHYUNSOLD"
    )
  ) {
    return jsonError(
      "올바르지 않은 결제번호입니다.",
      400
    );
  }

  let portOneResponse: Response;

  try {
    portOneResponse =
      await fetch(
        `${PORTONE_API_BASE}/payments/${encodeURIComponent(
          paymentId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `PortOne ${apiSecret}`,
          },
          cache: "no-store",
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
      responseBody as PortOneErrorResponse;

    return jsonError(
      "결제 정보를 확인하지 못했습니다.",
      portOneResponse.status,
      error.message ||
        error.type ||
        "포트원 결제 조회 오류가 발생했습니다."
    );
  }

  const payment =
    responseBody as PortOnePayment;

  if (
    payment.id &&
    payment.id !== paymentId
  ) {
    return jsonError(
      "조회된 결제번호가 요청 정보와 일치하지 않습니다.",
      409
    );
  }

  if (
    payment.storeId &&
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
    REPORT_PRICE
  ) {
    return jsonError(
      "결제 금액이 올바르지 않습니다.",
      409,
      `확인된 결제 금액: ${
        payment.amount?.total ??
        "UNKNOWN"
      }`
    );
  }

  if (
    payment.currency &&
    payment.currency !== "KRW"
  ) {
    return jsonError(
      "결제 통화가 올바르지 않습니다.",
      409,
      `확인된 결제 통화: ${payment.currency}`
    );
  }

  if (
    payment.status !== "PAID"
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
      paymentId:
        payment.id ??
        paymentId,
      transactionId:
        payment.transactionId ??
        null,
      status:
        payment.status,
      totalAmount:
        payment.amount.total,
      currency:
        payment.currency ??
        "KRW",
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