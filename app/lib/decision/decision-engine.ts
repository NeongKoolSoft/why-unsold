import type {
  ConfidenceLevel,
  DecisionInput,
  DecisionResult,
  DecisionType,
  ListingStage,
  MarketState,
  PriceState,
  ReactionState,
} from "./decision-types";

export function evaluateDecision(
  input: DecisionInput
): DecisionResult {
  const listingStage = getListingStage(input.daysListed);

  const priceState = getPriceState(
    input.askingPrice,
    input.referenceTradePrice
  );

  const reactionState = getReactionState(input);
  const marketState = getMarketState(input);

  const decision = getDecision({
    listingStage,
    priceState,
    reactionState,
    marketState,
  });

  const confidence = getConfidence(
    input,
    marketState
  );

  return {
    decision,
    confidence,
    marketState,
    priceState,
    reactionState,
    listingStage,
    headline: getHeadline(decision),
    evidences: getEvidences(
        input,
        priceState,
        reactionState,
        marketState,
        listingStage
    ),
    actions: getActions(decision),
    nextReview: getNextReview(decision),
  };
}

function getListingStage(
  daysListed: number
): ListingStage {
  if (daysListed <= 14) return "EARLY";
  if (daysListed <= 30) return "WATCH";

  return "STALLED";
}

function getPriceState(
  askingPrice: number,
  referenceTradePrice?: number | null
): PriceState {
  if (!referenceTradePrice || referenceTradePrice <= 0) {
    return "UNKNOWN";
  }

  const diffRate =
    ((askingPrice - referenceTradePrice) /
      referenceTradePrice) *
    100;

  if (diffRate <= 3) {
    return "COMPETITIVE";
  }

  if (diffRate <= 7) {
    return "SLIGHTLY_HIGH";
  }

  return "HIGH";
}

function getReactionState(
  input: DecisionInput
): ReactionState {
  if (input.inquiries === 0) {
    return "NO_INQUIRY";
  }

  if (input.visits === 0) {
    return "INQUIRY_NO_VISIT";
  }

  if (input.negotiations === 0) {
    return "VISIT_NO_NEGOTIATION";
  }

  return "REACTION_ACTIVE";
}

function getMarketState(
  input: DecisionInput
): MarketState {
  if (
    input.sameSizeTradeGapMonths != null &&
    input.sameSizeTradeGapMonths >= 12
  ) {
    return "THIN";
  }

  if (
    input.recentTradeCount != null &&
    input.recentTradeCount >= 5
  ) {
    return "ACTIVE";
  }

  return "NORMAL";
}

function getDecision(params: {
  listingStage: ListingStage;
  priceState: PriceState;
  reactionState: ReactionState;
  marketState: MarketState;
}): DecisionType {
  const {
    listingStage,
    priceState,
    reactionState,
    marketState,
  } = params;

  if (
    listingStage === "EARLY" &&
    priceState !== "HIGH"
  ) {
    return "OBSERVE";
  }

  if (
    reactionState === "REACTION_ACTIVE" &&
    priceState !== "HIGH"
  ) {
    return "KEEP";
  }

  if (
    listingStage === "STALLED" &&
    priceState === "HIGH" &&
    reactionState === "NO_INQUIRY" &&
    marketState !== "THIN"
  ) {
    return "STRONG_ADJUST";
  }

  if (
    listingStage === "STALLED" &&
    priceState === "SLIGHTLY_HIGH" &&
    reactionState !== "REACTION_ACTIVE"
  ) {
    return "SMALL_ADJUST";
  }

  if (
    listingStage === "STALLED" &&
    priceState === "COMPETITIVE" &&
    (
        reactionState === "NO_INQUIRY" ||
        reactionState === "INQUIRY_NO_VISIT"
    )
  ) {
    return "CHECK_OTHER";
  }

  return "OBSERVE";
}

function getConfidence(
  input: DecisionInput,
  marketState: MarketState
): ConfidenceLevel {
  let score = 0;

  // 비교 가능한 실거래가 존재
  if (
    input.referenceTradePrice != null &&
    input.referenceTradePrice > 0
  ) {
    score += 2;
  }

  // 최근 거래량 정보 존재
  if (input.recentTradeCount != null) {
    score += 1;

    if (input.recentTradeCount >= 5) {
      score += 1;
    }
  }

  // 동일 면적 거래 공백 정보 존재
  if (
    input.sameSizeTradeGapMonths != null
  ) {
    score += 1;
  }

  // 실제 매도 반응 정보가 입력됨
  if (
    input.daysListed >= 0 &&
    input.inquiries >= 0 &&
    input.visits >= 0 &&
    input.negotiations >= 0
  ) {
    score += 1;
  }

  // 거래가 드문 시장이면 판단 확실성 하향
  if (marketState === "THIN") {
    score -= 2;
  }

  if (score >= 6) {
    return "HIGH";
  }

  if (score >= 3) {
    return "MEDIUM";
  }

  return "LOW";
}

function getHeadline(
  decision: DecisionType
): string {
  switch (decision) {
    case "OBSERVE":
      return "아직 가격을 조정하기보다 반응을 조금 더 확인할 단계입니다.";

    case "KEEP":
      return "현재 가격을 당장 바꿀 근거는 크지 않습니다.";

    case "SMALL_ADJUST":
      return "소폭 가격 조정을 검토할 단계입니다.";

    case "STRONG_ADJUST":
      return "현재 희망가격의 경쟁력을 적극적으로 다시 볼 단계입니다.";

    case "CHECK_OTHER":
      return "가격보다 다른 조건을 먼저 점검할 단계입니다.";
  }
}

function getActions(
  decision: DecisionType
): string[] {
  switch (decision) {
    case "OBSERVE":
      return [
        "현재 경쟁 매물 3개의 가격과 조건을 확인하세요.",
        "앞으로 7일간 문의와 방문 반응을 기록하세요.",
      ];

    case "KEEP":
      return [
        "현재 가격을 유지하면서 문의·방문 반응을 확인하세요.",
        "경쟁 매물의 가격 변화가 있는지 확인하세요.",
      ];

    case "SMALL_ADJUST":
      return [
        "현재 경쟁 매물 가격을 다시 확인하세요.",
        "소폭 조정 가능한 가격 범위를 검토하세요.",
      ];

    case "STRONG_ADJUST":
      return [
        "최근 비교 가능한 실거래와 경쟁 매물을 다시 확인하세요.",
        "현재 희망가격의 경쟁력을 다시 검토하세요.",
      ];

    case "CHECK_OTHER":
      return [
        "매물 노출 상태와 안내 내용을 점검하세요.",
        "층·방향·수리 상태·입주 조건을 다시 확인하세요.",
      ];
  }
}

function getNextReview(
  decision: DecisionType
): string {
  switch (decision) {
    case "OBSERVE":
      return "7일 후 또는 첫 방문이 발생하면 다시 확인하세요.";

    case "KEEP":
      return "7~14일 후 또는 문의·방문이 감소하면 다시 확인하세요.";

    case "SMALL_ADJUST":
      return "가격 조정 후 7일간 반응을 확인하세요.";

    case "STRONG_ADJUST":
      return "가격 변경 후 7일 또는 새로운 문의가 발생하면 다시 확인하세요.";

    case "CHECK_OTHER":
      return "조건을 점검한 뒤 또는 다음 방문·협상이 발생하면 다시 확인하세요.";
  }
}

function getEvidences(
  input: DecisionInput,
  priceState: PriceState,
  reactionState: ReactionState,
  marketState: MarketState,
  listingStage: ListingStage
) {
  const evidences = [];

  if (
    input.referenceTradePrice &&
    input.referenceTradePrice > 0
  ) {
    const diffRate =
      ((input.askingPrice - input.referenceTradePrice) /
        input.referenceTradePrice) *
      100;

    evidences.push({
      label: "가격 위치",
      value: `실거래 대비 ${
        diffRate >= 0 ? "+" : ""
      }${diffRate.toFixed(1)}%`,
      description:
        priceState === "HIGH"
          ? "현재 희망가격이 비교 실거래보다 높은 편입니다."
          : priceState === "SLIGHTLY_HIGH"
          ? "현재 희망가격이 비교 실거래보다 다소 높은 편입니다."
          : "현재 희망가격은 비교 실거래와 큰 차이가 없습니다.",
    });
  } else {
    evidences.push({
      label: "가격 위치",
      value: "비교 거래 부족",
      description:
        "최근 비교 가능한 실거래가 부족해 가격 위치 판단에 제한이 있습니다.",
    });
  }

  evidences.push({
    label: "매도 기간",
    value: `등록 후 ${input.daysListed}일`,
    description:
      listingStage === "EARLY"
        ? "아직 초기 반응을 확인할 수 있는 기간입니다."
        : listingStage === "WATCH"
        ? "매수 반응이 어떻게 나타나는지 확인할 시점입니다."
        : "등록 기간이 길어져 정체 여부를 함께 살펴볼 필요가 있습니다.",
  });

  evidences.push({
    label: "매수 반응",
    value: `문의 ${input.inquiries}회 · 방문 ${input.visits}회`,
    description:
      reactionState === "NO_INQUIRY"
        ? "현재까지 문의가 없어 관심 단계에서 반응이 약합니다."
        : reactionState === "INQUIRY_NO_VISIT"
        ? "문의는 있지만 방문으로 이어지지 않고 있습니다."
        : reactionState === "VISIT_NO_NEGOTIATION"
        ? "방문은 발생했지만 협상으로 이어지지 않고 있습니다."
        : "문의·방문·협상 반응이 실제로 발생하고 있습니다.",
  });

  if (
    marketState === "THIN" &&
    evidences.length >= 3
  ) {
    evidences[2] = {
      label: "시장 유동성",
      value: "거래가 드문 편",
      description:
        "동일 면적 거래 공백이 길어, 가격만으로 반응 부족 원인을 판단하기 어렵습니다.",
    };
  }

  return evidences.slice(0, 3);
}