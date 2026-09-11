import type {
  Cause,
  Diagnosis,
} from "../report-types";

import {
  EXECUTION_STRATEGY_PRODUCT_CODE,
} from "../execution-strategy-types";

import type {
  ExecutionStrategyInput,
  ListingExposureStatus,
  ListingQualityStatus,
  PriceAdjustmentRange,
  SaleDeadline,
  StrategyPurchasePayload,
} from "../execution-strategy-types";

const VALID_CAUSES:
  readonly Cause[] = [
    "price",
    "liquidity",
    "exposure",
    "conversion",
    "condition",
  ];

const VALID_SALE_DEADLINES:
  readonly SaleDeadline[] = [
    "within_30_days",
    "within_60_days",
    "within_90_days",
    "flexible",
  ];

const VALID_PRICE_ADJUSTMENT_RANGES:
  readonly PriceAdjustmentRange[] = [
    "maintain",
    "within_3_percent",
    "within_5_percent",
    "over_5_percent",
    "undecided",
  ];

const VALID_EXPOSURE_STATUSES:
  readonly ListingExposureStatus[] = [
    "not_checked",
    "limited",
    "sufficient",
    "unknown",
  ];

const VALID_QUALITY_STATUSES:
  readonly ListingQualityStatus[] = [
    "needs_improvement",
    "average",
    "good",
    "unknown",
  ];

function isPlainObject(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isFiniteNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function isNonNegativeNumberOrNull(
  value: unknown
) {
  return (
    value === null ||
    (
      isFiniteNumber(value) &&
      value >= 0
    )
  );
}

function isOptionalText(
  value: unknown,
  maximumLength: number
) {
  return (
    value === undefined ||
    (
      typeof value === "string" &&
      value.length <=
        maximumLength
    )
  );
}

export function isDiagnosisForStrategy(
  value: unknown
): value is Diagnosis {
  if (!isPlainObject(value)) {
    return false;
  }

  const diagnosis =
    value as Partial<Diagnosis>;

  if (
    typeof diagnosis.cause !==
      "string" ||
    !VALID_CAUSES.includes(
      diagnosis.cause as Cause
    )
  ) {
    return false;
  }

  if (
    typeof diagnosis.reportId !==
      "string" ||
    !diagnosis.reportId.trim() ||
    diagnosis.reportId.length > 100
  ) {
    return false;
  }

  if (
    typeof diagnosis.complex !==
      "string" ||
    !diagnosis.complex.trim() ||
    typeof diagnosis.apartmentName !==
      "string" ||
    !diagnosis.apartmentName.trim() ||
    typeof diagnosis.area !==
      "string" ||
    !diagnosis.area.trim() ||
    typeof diagnosis.askingPrice !==
      "string" ||
    !diagnosis.askingPrice.trim()
  ) {
    return false;
  }

  if (
    !isPlainObject(
      diagnosis.metrics
    )
  ) {
    return false;
  }

  const metrics =
    diagnosis.metrics;

  if (
    !isFiniteNumber(
      metrics.askingPrice
    ) ||
    metrics.askingPrice <= 0 ||
    !isFiniteNumber(
      metrics.latestTradePrice
    ) ||
    metrics.latestTradePrice <= 0 ||
    !isFiniteNumber(
      metrics.lowestListingPrice
    ) ||
    metrics.lowestListingPrice <= 0 ||
    !isFiniteNumber(
      metrics.listedDays
    ) ||
    metrics.listedDays < 0
  ) {
    return false;
  }

  if (
    !isNonNegativeNumberOrNull(
      metrics.inquiries
    ) ||
    !isNonNegativeNumberOrNull(
      metrics.visits
    ) ||
    !isNonNegativeNumberOrNull(
      metrics.offers
    )
  ) {
    return false;
  }

  /*
   * 실행전략은 결제가 완료된 V1 AI 리포트를
   * 기초자료로 사용하므로 상세 분석 결과가 필요합니다.
   */
  if (
    !isPlainObject(
      diagnosis.aiDetailAnalysis
    )
  ) {
    return false;
  }

  return true;
}

export function isExecutionStrategyInput(
  value: unknown
): value is ExecutionStrategyInput {
  if (!isPlainObject(value)) {
    return false;
  }

  const input =
    value as Partial<ExecutionStrategyInput>;

  if (
    typeof input.saleDeadline !==
      "string" ||
    !VALID_SALE_DEADLINES.includes(
      input.saleDeadline as SaleDeadline
    )
  ) {
    return false;
  }

  if (
    typeof input.priceAdjustmentRange !==
      "string" ||
    !VALID_PRICE_ADJUSTMENT_RANGES.includes(
      input.priceAdjustmentRange as PriceAdjustmentRange
    )
  ) {
    return false;
  }

  const minimumAcceptablePrice =
    input.minimumAcceptablePrice;

  if (
    minimumAcceptablePrice !==
      undefined &&
    (
      typeof minimumAcceptablePrice !==
        "number" ||
      !Number.isInteger(
        minimumAcceptablePrice
      ) ||
      minimumAcceptablePrice <= 0
    )
  ) {
    return false;
  }

  const brokerCount =
    input.brokerCount;

  if (
    typeof brokerCount !==
      "number" ||
    !Number.isInteger(
      brokerCount
    ) ||
    brokerCount < 0 ||
    brokerCount > 100
  ) {
    return false;
  }

  const competitorListingCount =
    input.competitorListingCount;

  if (
    competitorListingCount !==
      undefined &&
    (
      typeof competitorListingCount !==
        "number" ||
      !Number.isInteger(
        competitorListingCount
      ) ||
      competitorListingCount < 0 ||
      competitorListingCount > 1000
    )
  ) {
    return false;
  }

  if (
    typeof input.listingExposureStatus !==
      "string" ||
    !VALID_EXPOSURE_STATUSES.includes(
      input.listingExposureStatus as ListingExposureStatus
    )
  ) {
    return false;
  }

  if (
    typeof input.listingQualityStatus !==
      "string" ||
    !VALID_QUALITY_STATUSES.includes(
      input.listingQualityStatus as ListingQualityStatus
    )
  ) {
    return false;
  }

  if (
    !isOptionalText(
      input.repeatedFeedback,
      1000
    ) ||
    !isOptionalText(
      input.saleConstraints,
      1000
    )
  ) {
    return false;
  }

  return true;
}

export function validateExecutionStrategyConstraints(
  diagnosis: Diagnosis,
  input: ExecutionStrategyInput
): string | null {
  const minimumPrice =
    input.minimumAcceptablePrice;

  if (
    minimumPrice !== undefined &&
    minimumPrice >
      diagnosis.metrics.askingPrice
  ) {
    return (
      "최저 수용 가능 가격은 " +
      "현재 희망가보다 높을 수 없습니다."
    );
  }

  return null;
}

export function buildStrategyPurchasePayload(
  diagnosis: Diagnosis,
  executionInput:
    ExecutionStrategyInput
): StrategyPurchasePayload {
  return {
    product:
      EXECUTION_STRATEGY_PRODUCT_CODE,

    diagnosis,

    executionInput,
  };
}