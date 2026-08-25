import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAnalysisToken,
  hashDiagnosis,
  verifyOrderToken,
} from "../../../lib/payment-security";

const PORTONE_API_BASE =
  "https://api.portone.io";

const REPORT_PRICE = 20000;

type ConfirmRequestBody = {
  paymentId?: unknown;
  orderToken?: unknown;
  diagnosis?: unknown;
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
    typeof body.paymentId === "string"
      ? body.paymentId.trim()
      : "";

  const orderToken =
    typeof body.orderToken === "string"
      ? body.orderToken.trim()
      : "";

  const diagnosis =
    body.diagnosis;

  if (!paymentId) {
    return jsonError(
      "paymentId를 확인해주세요.",
      400
    );
  }

  if (
    !paymentId.startsWith(
      "WHYUNSOLD"
    ) ||
    paymentId.length > 40
  ) {
    return jsonError(
      "올바르지 않은 결제번호입니다.",
      400
    );
  }

  if (!orderToken) {
    return jsonError(
      "주문 보안정보를 확인할 수 없습니다.",
      400
    );
  }

  if (
    !diagnosis ||
    typeof diagnosis !== "object" ||
    Array.isArray(diagnosis)
  ) {
    return jsonError(
      "분석 정보를 확인할 수 없습니다.",
      400
    );
  }

  /*
   * 결제 전 서버가 발급한 주문 토큰을 검증합니다.
   * paymentId + 금액 + Diagnosis 해시가
   * 결제 당시 값과 동일해야 합니다.
   */
  let verifiedOrder;

  try {
    verifiedOrder =
      verifyOrderToken(
        orderToken
      );
  } catch (error) {
    console.error(
      "[payment/confirm] order token verification error",
      error
    );

    return jsonError(
      "주문 보안정보를 검증하지 못했습니다.",
      500
    );
  }

  if (!verifiedOrder) {
    return jsonError(
      "주문 보안정보가 올바르지 않거나 만료되었습니다.",
      409
    );
  }

  if (
    verifiedOrder.paymentId !==
    paymentId
  ) {
    return jsonError(
      "주문 결제번호가 일치하지 않습니다.",
      409
    );
  }

  if (
    verifiedOrder.amount !==
    REPORT_PRICE
  ) {
    return jsonError(
      "주문 금액이 올바르지 않습니다.",
      409
    );
  }

  let diagnosisHash: string;

  try {
    diagnosisHash =
      hashDiagnosis(
        diagnosis
      );
  } catch {
    return jsonError(
      "분석 정보의 형식이 올바르지 않습니다.",
      400
    );
  }

  if (
    verifiedOrder.diagnosisHash !==
    diagnosisHash
  ) {
    return jsonError(
      "결제 당시 분석 정보와 현재 분석 정보가 일치하지 않습니다.",
      409
    );
  }

  /*
   * PortOne 서버에서 실제 결제 상태를 다시 조회합니다.
   */
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

  /*
   * 결제번호는 응답에 반드시 존재하고
   * 요청한 paymentId와 동일해야 합니다.
   */
  if (
    !payment.id ||
    payment.id !== paymentId
  ) {
    return jsonError(
      "조회된 결제번호가 요청 정보와 일치하지 않습니다.",
      409
    );
  }

  /*
   * Store ID도 반드시 존재하고
   * 우리 상점과 동일해야 합니다.
   */
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

  /*
   * 실제 결제금액 확인
   */
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

  /*
   * 통화도 누락 없이 KRW여야 합니다.
   */
  if (
    payment.currency !== "KRW"
  ) {
    return jsonError(
      "결제 통화가 올바르지 않습니다.",
      409,
      `확인된 결제 통화: ${
        payment.currency ??
        "UNKNOWN"
      }`
    );
  }

  /*
   * 실제 결제 완료 상태 확인
   */
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

  /*
   * 여기까지 통과한 경우에만
   * 해당 Diagnosis에 대한 분석 토큰을 발급합니다.
   */
  let analysisToken: string;

  try {
    analysisToken =
      createAnalysisToken(
        paymentId,
        REPORT_PRICE,
        diagnosis
      );
  } catch (error) {
    console.error(
      "[payment/confirm] analysis token creation error",
      error
    );

    return jsonError(
      "분석 보안정보를 생성하지 못했습니다.",
      500
    );
  }

  return NextResponse.json({
    ok: true,

    analysisToken,

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