import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createOrderToken,
} from "../../../lib/payment-security";

const PRODUCT_PRICES = {
  "price-check": 2900,
  "stagnation-diagnosis": 9900,
  "execution-strategy": 14500,
} as const;

type ProductId =
  keyof typeof PRODUCT_PRICES;

type OrderTokenRequestBody = {
  productId?: unknown;
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

function isProductId(
  value: string
): value is ProductId {
  return Object.prototype.hasOwnProperty.call(
    PRODUCT_PRICES,
    value
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

  /*
   * 기존 매도 정체 진단 요청은 productId를 보내지 않으므로
   * 매도 정체 진단을 기본 상품으로 처리합니다.
   */
  const requestedProductId =
    typeof body.productId === "string"
      ? body.productId.trim()
      : "";

  const productId: ProductId =
    requestedProductId ||
    body.productId === undefined
      ? requestedProductId
        ? isProductId(
            requestedProductId
          )
          ? requestedProductId
          : "stagnation-diagnosis"
        : "stagnation-diagnosis"
      : "stagnation-diagnosis";

  /*
   * productId가 전달됐지만 등록된 상품이 아니면 거부합니다.
   */
  if (
    requestedProductId &&
    !isProductId(
      requestedProductId
    )
  ) {
    return jsonError(
      "올바르지 않은 상품입니다.",
      400
    );
  }

  const reportPrice =
    PRODUCT_PRICES[productId];

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

  /*
   * 클라이언트가 보낸 금액과
   * 서버에 등록된 상품 가격이 동일한지 확인합니다.
   */
  if (
    !Number.isFinite(amount) ||
    amount !== reportPrice
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
        reportPrice,
        body.diagnosis
      );

    return NextResponse.json({
      ok: true,
      productId,
      amount: reportPrice,
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
