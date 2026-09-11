import type {
  Cause,
  Diagnosis,
} from "./report-types";

export const EXECUTION_STRATEGY_PRODUCT_CODE =
  "execution_strategy_v0" as const;

export type SaleDeadline =
  | "within_30_days"
  | "within_60_days"
  | "within_90_days"
  | "flexible";

export type PriceAdjustmentRange =
  | "maintain"
  | "within_3_percent"
  | "within_5_percent"
  | "over_5_percent"
  | "undecided";

export type ListingExposureStatus =
  | "not_checked"
  | "limited"
  | "sufficient"
  | "unknown";

export type ListingQualityStatus =
  | "needs_improvement"
  | "average"
  | "good"
  | "unknown";

export type StrategyPriority =
  | "speed"
  | "balance"
  | "price_defense";

export type StrategyFocus =
  Cause;

export type PriceStance =
  | "maintain"
  | "conditional_adjust"
  | "adjust_within_limit";

export type WeeklyPeriod =
  | "1-7"
  | "8-14"
  | "15-21"
  | "22-30";

export type ResponseStage =
  | "no_inquiry"
  | "inquiry_no_visit"
  | "visit_no_offer"
  | "offer_no_contract";

export type ChecklistType =
  | "brokerage"
  | "exposure"
  | "listing_content"
  | "visit_conversion";

export type Day30OutcomeType =
  | "continue"
  | "change_strategy"
  | "rediagnose";

export type TrackingMetricKey =
  | "askingPrice"
  | "competitorCount"
  | "inquiries"
  | "visits"
  | "offers";

export type ExecutionStrategyInput = {
  saleDeadline: SaleDeadline;

  priceAdjustmentRange:
    PriceAdjustmentRange;

  minimumAcceptablePrice?: number;

  brokerCount: number;

  competitorListingCount?: number;

  listingExposureStatus:
    ListingExposureStatus;

  listingQualityStatus:
    ListingQualityStatus;

  repeatedFeedback?: string;

  saleConstraints?: string;
};

export type StrategyPurchasePayload = {
  product:
    typeof EXECUTION_STRATEGY_PRODUCT_CODE;

  diagnosis: Diagnosis;

  executionInput:
    ExecutionStrategyInput;
};

export type StrategyObjective = {
  headline: string;

  priority: StrategyPriority;

  summary: string;

  successSignals: string[];

  constraintConflicts: string[];
};

export type RecommendedStrategy = {
  primaryFocus: StrategyFocus;

  priceStance: PriceStance;

  headline: string;

  summary: string;

  reasons: string[];

  maintainConditions: string[];

  changeConditions: string[];

  avoidActions: string[];
};

export type WeeklyObservation = {
  item: string;

  method: string;
};

export type WeeklyDecisionCriterion = {
  condition: string;

  meaning: string;
};

export type WeeklyAction = {
  title: string;

  detail: string;

  completionCheck: string;
};

export type WeeklyExecutionPlan = {
  period: WeeklyPeriod;

  title: string;

  objective: string;

  observations:
    WeeklyObservation[];

  decisionCriteria:
    WeeklyDecisionCriterion[];

  actions:
    WeeklyAction[];

  nextStepCondition: string;
};

export type ResponseBranch = {
  stage: ResponseStage;

  label: string;

  observation: string;

  interpretation: string;

  actions: string[];

  reassessWhen: string;
};

export type ChecklistItem = {
  label: string;

  reason: string;

  priority:
    | "required"
    | "recommended";
};

export type ChecklistGroup = {
  type: ChecklistType;

  title: string;

  items: ChecklistItem[];
};

export type TrackingMetric = {
  key: TrackingMetricKey;

  label: string;

  baseline: string;
};

export type TrackingCheckpoint = {
  day:
    | 0
    | 7
    | 14
    | 30;

  label: string;
};

export type TrackingPlan = {
  metrics: TrackingMetric[];

  checkpoints:
    TrackingCheckpoint[];
};

export type Day30Outcome = {
  type: Day30OutcomeType;

  condition: string;

  action: string;
};

export type Day30Decision = {
  summary: string;

  outcomes: Day30Outcome[];
};

export type AiExecutionStrategy = {
  objective: StrategyObjective;

  recommendedStrategy:
    RecommendedStrategy;

  weeklyPlans:
    WeeklyExecutionPlan[];

  responseBranches:
    ResponseBranch[];

  checklistGroups:
    ChecklistGroup[];

  day30Decision:
    Day30Decision;

  limitations: string[];
};

export type PropertySnapshot = {
  complex: string;

  apartmentName: string;

  area: string;

  askingPrice: number;

  listedDays: number;

  inquiries: number | null;

  visits: number | null;

  offers: number | null;

  competitorListingCount:
    number | null;

  lowestListingPrice: number;

  latestTradePrice: number;
};

export type ExecutionStrategy =
  AiExecutionStrategy & {
    strategyId: string;

    sourceReportId: string;

    createdAt: string;

    dataDate: string;

    propertySnapshot:
      PropertySnapshot;

    trackingPlan:
      TrackingPlan;
  };