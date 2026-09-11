import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  hashDiagnosis,
  verifyAnalysisToken,
} from "../../lib/payment-security";

import type {
  PriceCheckOrderData,
  PriceCheckPosition,
  PriceCheckReport,
} from "../../price-check-types";

const PRICE_CHECK_PRICE =
  4900;

type PriceCheckRequestBody = {
  paymentId?: unknown;
  analysisToken?: unknown;
  diagnosis?: unknown;
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

function isRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isFiniteNumber(
  value: unknown
): value is number {
  return (
    typeof value ===
      "number" &&
    Number.isFinite(value)
  );
}

function isPriceCheckOrderData(
  value: unknown
): value is PriceCheckOrderData {
  if (
    !isRecord(value) ||
    value.productId !==
      "price-check" ||
    !isRecord(
      value.property
    ) ||
    !isRecord(
      value.market
    )
  ) {
    return false;
  }

  const property =
    value.property;

  const market =
    value.market;

  return (
    typeof property.regionName ===
      "string" &&
    typeof property.districtName ===
      "string" &&
    typeof property.lawdCd ===
      "string" &&
    typeof property.legalDong ===
      "string" &&
    typeof property.apartmentName ===
      "string" &&
    isFiniteNumber(
      property.exclusiveArea
    ) &&
    property.exclusiveArea >
      0 &&
    isFiniteNumber(
      property.askingPrice
    ) &&
    property.askingPrice >
      0 &&
    typeof market.dataDate ===
      "string" &&
    isFiniteNumber(
      market.complexTransactionCount12m
    ) &&
    isFiniteNumber(
      market.sameAreaTransactionCount12m
    ) &&
    isFiniteNumber(
      market.latestTradePrice
    ) &&
    market.latestTradePrice >
      0 &&
    (
      market.monthsSinceLastTrade ===
        null ||
      isFiniteNumber(
        market.monthsSinceLastTrade
      )
    ) &&
    isRecord(
      market.latestTransaction
    ) &&
    Array.isArray(
      market.sameAreaTransactions12m
    )
  );
}

function formatPrice(
  price: number
) {
  const roundedPrice =
    Math.round(price);

  const sign =
    roundedPrice < 0
      ? "-"
      : "";

  const absolutePrice =
    Math.abs(
      roundedPrice
    );

  const eok =
    Math.floor(
      absolutePrice /
        10000
    );

  const manwon =
    absolutePrice %
    10000;

  if (
    eok > 0 &&
    manwon > 0
  ) {
    return `${sign}${eok.toLocaleString(
      "ko-KR"
    )}억 ${manwon.toLocaleString(
      "ko-KR"
    )}만원`;
  }

  if (
    eok > 0
  ) {
    return `${sign}${eok.toLocaleString(
      "ko-KR"
    )}억원`;
  }

  return `${sign}${manwon.toLocaleString(
    "ko-KR"
  )}만원`;
}

function formatArea(
  area: number
) {
  return Number.isInteger(area)
    ? String(area)
    : area.toFixed(2);
}

function createReportId() {
  return `PRICE-${Date.now()
    .toString(36)
    .toUpperCase()}`;
}

function determinePosition(
  gapPercent: number,
  monthsSinceLastTrade:
    | number
    | null
): {
  type:
    PriceCheckPosition;
  label: string;
  headline: string;
  summary: string;
} {
  /*
   * 동일 면적의 마지막 거래가 24개월 이상 지났으면
   * 가격 차이보다 자료의 시점을 우선해서 안내합니다.
   */
  if (
    monthsSinceLastTrade ===
      null ||
    monthsSinceLastTrade >=
      24
  ) {
    return {
      type:
        "stale-data",

      label:
        "최근 거래자료 오래됨",

      headline:
        monthsSinceLastTrade ===
        null
          ? "동일 면적의 최근 거래 시점을 확인하기 어렵습니다."
          : `동일 면적의 마지막 거래가 ${monthsSinceLastTrade}개월 전이라 현재 가격 판단에 주의가 필요합니다.`,

      summary:
        "확인된 동일 면적 실거래가 오래되어 현재 시장가격을 그대로 설명하기 어렵습니다. 이번 가격 차이는 참고값으로만 보고, 현재 경쟁 매물과 인근 유사 단지의 최근 거래를 추가로 확인하세요.",
    };
  }

  /*
   * 최근 거래가격보다 3% 넘게 낮은 경우
   */
  if (
    gapPercent < -3
  ) {
    const isMuchLower =
      gapPercent <= -10;

    return {
      type:
        "below-market",

      label:
        isMuchLower
          ? "최근 거래 대비 크게 낮음"
          : "최근 거래 대비 낮음",

      headline:
        isMuchLower
          ? "희망가격이 최근 동일 면적 거래가격보다 크게 낮습니다."
          : "희망가격이 최근 동일 면적 거래가격보다 낮습니다.",

      summary:
        isMuchLower
          ? "빠른 매도를 위한 의도적인 가격인지, 희망가격 입력 단위나 세대 조건에 차이가 있는지 먼저 확인하세요. 특별한 이유가 없다면 지나치게 낮은 가격으로 등록하지 않도록 현재 경쟁 매물도 함께 비교하는 것이 좋습니다."
          : "최근 실거래만 놓고 보면 가격 경쟁력이 있는 구간입니다. 다만 층·향·수리 상태 차이와 현재 경쟁 매물을 확인한 뒤 최종 등록가격을 결정하세요.",
    };
  }

  if (
    gapPercent <= 2
  ) {
    return {
      type:
        "competitive",

      label:
        "최근 거래가격 범위",

      headline:
        "희망가격이 최근 동일 면적 거래가격과 비슷한 구간입니다.",

      summary:
        "최근 실거래만 놓고 보면 가격 차이가 크지 않은 구간입니다. 매물을 내놓기 전 층·향·수리 상태와 현재 경쟁 매물을 추가로 확인해 최종 가격을 결정하세요.",
    };
  }

  if (
    gapPercent <= 5
  ) {
    return {
      type:
        "near-market",

      label:
        "최근 거래가격 근접",

      headline:
        "희망가격이 최근 거래가격보다 조금 높은 구간입니다.",

      summary:
        "가격 차이가 아주 크지는 않지만 현재 경쟁 매물과 거래 흐름에 따라 초기 문의 반응이 달라질 수 있습니다. 가격을 확정하기 전 경쟁 매물 최저가를 함께 확인하는 것이 좋습니다.",
    };
  }

  if (
    gapPercent <= 10
  ) {
    return {
      type:
        "review-needed",

      label:
        "가격 점검 필요",

      headline:
        "희망가격과 최근 동일 면적 거래가격 사이에 점검할 차이가 있습니다.",

      summary:
        "최근 실거래 대비 가격 차이가 초기 문의를 줄일 수 있는 구간입니다. 현재 가격을 유지할 근거가 있는지 확인하고, 없다면 매물 등록 전에 조정 범위를 정하는 것이 좋습니다.",
    };
  }

  return {
    type:
      "high",

    label:
      "최근 거래 대비 높음",

    headline:
      "희망가격이 최근 동일 면적 거래가격보다 높은 구간입니다.",

    summary:
      "최근 실거래와의 차이가 커 가격 경쟁력이 낮아질 가능성이 있습니다. 층·향·수리 상태 등의 뚜렷한 우위가 없다면 등록 전 가격 조정을 우선 검토하는 것이 좋습니다.",
  };
}

function createActionPoints(
  position:
    PriceCheckPosition
) {
  if (
    position ===
    "stale-data"
  ) {
    return [
      "현재 등록된 같은 단지·같은 면적의 경쟁 매물 가격을 확인하세요.",
      "인근 유사 단지에서 최근 6개월 안에 거래된 비슷한 면적의 가격을 비교하세요.",
      "중개사에게 현재 실제 문의가 발생하는 가격대를 확인한 뒤 희망가격을 결정하세요.",
    ];
  }

  if (
    position ===
    "below-market"
  ) {
    return [
      "희망가격을 만원 단위로 정확하게 입력했는지 다시 확인하세요.",
      "최근 거래보다 낮게 내놓아야 할 세대 조건이나 빠른 매도 목적이 있는지 점검하세요.",
      "현재 경쟁 매물과 비교해 필요 이상으로 낮은 가격에 등록하지 않도록 확인하세요.",
    ];
  }

  if (
    position ===
    "competitive"
  ) {
    return [
      "현재 경쟁 매물 중 같은 면적의 최저가와 비교하세요.",
      "층·향·수리 상태 차이를 반영해 최종 희망가격을 결정하세요.",
      "등록 후 7일 동안 문의 반응을 기록할 기준을 미리 정하세요.",
    ];
  }

  if (
    position ===
    "near-market"
  ) {
    return [
      "같은 단지·같은 면적의 현재 경쟁 매물 가격을 확인하세요.",
      "최근 실거래보다 높은 가격을 설명할 세대 조건이 있는지 점검하세요.",
      "초기 문의가 없을 때 조정할 가격 범위를 등록 전에 정하세요.",
    ];
  }

  if (
    position ===
    "review-needed"
  ) {
    return [
      "희망가격을 유지할 수 있는 층·향·수리 상태의 우위가 있는지 확인하세요.",
      "최근 실거래와 경쟁 매물 사이에서 현실적인 등록가격을 다시 계산하세요.",
      "매물을 등록하기 전에 1차 조정가격과 조정 시점을 정하세요.",
    ];
  }

  return [
    "최근 실거래와의 가격 차이를 먼저 줄일 수 있는지 검토하세요.",
    "높은 희망가격을 뒷받침할 명확한 세대 조건과 경쟁 매물 차이를 확인하세요.",
    "가격을 유지한다면 장기 매도 가능성과 조정 기준을 함께 정하세요.",
  ];
}

function createReport(
  diagnosis:
    PriceCheckOrderData
): PriceCheckReport {
  const askingPrice =
    diagnosis.property
      .askingPrice;

  const latestTradePrice =
    diagnosis.market
      .latestTradePrice;

  if (
    latestTradePrice ===
    null
  ) {
    throw new Error(
      "최근 동일 면적 실거래가격을 확인할 수 없습니다."
    );
  }

  const difference =
    askingPrice -
    latestTradePrice;

  const gapPercent =
    Math.round(
      (
        difference /
        latestTradePrice
      ) *
        1000
    ) / 10;

  const monthsSinceLastTrade =
    diagnosis.market
      .monthsSinceLastTrade;

  const position =
    determinePosition(
      gapPercent,
      monthsSinceLastTrade
    );

  const latestTransaction =
    diagnosis.market
      .latestTransaction;

  const latestTradeDate =
    latestTransaction
      ? `${latestTransaction.dealYear}.${String(
          latestTransaction.dealMonth
        ).padStart(
          2,
          "0"
        )}.${String(
          latestTransaction.dealDay
        ).padStart(
          2,
          "0"
        )}`
      : "확인 불가";

  return {
    reportId:
      createReportId(),

    createdAt:
      new Date().toISOString(),

    dataDate:
      diagnosis.market
        .dataDate,

    property:
      diagnosis.property,

    judgment: {
      position:
        position.type,

      label:
        position.label,

      headline:
        position.headline,

      summary:
        position.summary,
    },

    metrics: {
      askingPrice,
      latestTradePrice,

      priceDifference:
        difference,

      priceGapPercent:
        gapPercent,

      sameAreaTransactionCount12m:
        diagnosis.market
          .sameAreaTransactionCount12m,

      complexTransactionCount12m:
        diagnosis.market
          .complexTransactionCount12m,

      monthsSinceLastTrade,
    },

    evidence: [
      {
        label:
          "입력한 희망가격",

        value:
          formatPrice(
            askingPrice
          ),

        description:
          "매물을 내놓기 전 사용자가 입력한 희망가격입니다.",
      },

      {
        label:
          "최근 동일 면적 실거래",

        value:
          formatPrice(
            latestTradePrice
          ),

        description:
          `${latestTradeDate}에 거래된 전용 ${Math.floor(
            diagnosis.property
                .exclusiveArea
          )}㎡대 최근 거래가격입니다.`,
      },

      {
        label:
          "최근 거래가격과 차이",

        value:
          `${difference >= 0 ? "+" : ""}${formatPrice(
            difference
          )} · ${
            gapPercent >= 0
              ? "+"
              : ""
          }${gapPercent}%`,

        description:
          "입력한 희망가격과 최근 동일 면적 실거래가격의 차이입니다.",
      },

      {
        label:
          "최근 12개월 동일 면적 거래",

        value:
          `${diagnosis.market.sameAreaTransactionCount12m.toLocaleString(
            "ko-KR"
          )}건`,

        description:
          "같은 단지에서 동일 면적형으로 분류된 최근 12개월 거래 건수입니다.",
      },

      {
        label:
          "최근 거래 이후 공백",

        value:
          monthsSinceLastTrade ===
          null
            ? "확인 불가"
            : `${monthsSinceLastTrade}개월`,

        description:
          "같은 단지의 동일 면적형이 마지막으로 거래된 이후의 기간입니다.",
      },
    ],

    checkpoints:
      createActionPoints(
        position.type
      ),

    limitations: [
      "본 진단은 국토교통부 실거래가 공개자료를 기준으로 합니다.",
      "동일 면적은 전용면적의 소수점을 제외한 면적형 기준으로 묶어 비교합니다.",
      "개별 세대의 층·향·조망·수리 상태는 자동으로 반영되지 않습니다.",
      "현재 등록된 경쟁 매물의 실제 협상가격은 실거래 자료에 포함되지 않습니다.",
      "본 결과는 감정평가나 미래 매도가격 보장이 아니라 매도 전 가격 판단을 돕는 참고자료입니다.",
    ],
  };
}

export async function POST(
  request: NextRequest
) {
  let body:
    PriceCheckRequestBody;

  try {
    body =
      (await request.json()) as PriceCheckRequestBody;
  } catch {
    return jsonError(
      "가격 진단 요청 형식이 올바르지 않습니다.",
      400
    );
  }

  const paymentId =
    typeof body.paymentId ===
    "string"
      ? body.paymentId.trim()
      : "";

  const analysisToken =
    typeof body.analysisToken ===
    "string"
      ? body.analysisToken.trim()
      : "";

  if (
    !paymentId ||
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

  if (
    !analysisToken
  ) {
    return jsonError(
      "가격 진단 보안정보를 확인할 수 없습니다.",
      400
    );
  }

  if (
    !isPriceCheckOrderData(
      body.diagnosis
    )
  ) {
    return jsonError(
      "가격 진단 정보를 확인할 수 없습니다.",
      400
    );
  }

  let verifiedAnalysis;

  try {
    verifiedAnalysis =
      verifyAnalysisToken(
        analysisToken
      );
  } catch (error) {
    console.error(
      "[price-check] token verification error",
      error
    );

    return jsonError(
      "가격 진단 보안정보를 검증하지 못했습니다.",
      500
    );
  }

  if (
    !verifiedAnalysis
  ) {
    return jsonError(
      "가격 진단 보안정보가 올바르지 않거나 만료되었습니다.",
      409
    );
  }

  if (
    verifiedAnalysis.paymentId !==
    paymentId
  ) {
    return jsonError(
      "결제번호가 일치하지 않습니다.",
      409
    );
  }

  if (
    verifiedAnalysis.amount !==
    PRICE_CHECK_PRICE
  ) {
    return jsonError(
      "가격 진단 결제금액이 올바르지 않습니다.",
      409
    );
  }

  let diagnosisHash:
    string;

  try {
    diagnosisHash =
      hashDiagnosis(
        body.diagnosis
      );
  } catch {
    return jsonError(
      "가격 진단 정보의 형식이 올바르지 않습니다.",
      400
    );
  }

  if (
    verifiedAnalysis.diagnosisHash !==
    diagnosisHash
  ) {
    return jsonError(
      "결제 당시 가격 진단 정보와 현재 정보가 일치하지 않습니다.",
      409
    );
  }

  try {
    const report =
      createReport(
        body.diagnosis
      );

    return NextResponse.json({
      ok: true,
      report,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "가격 진단 결과를 생성하지 못했습니다.";

    console.error(
      "[price-check]",
      error
    );

    return jsonError(
      message,
      500
    );
  }
}