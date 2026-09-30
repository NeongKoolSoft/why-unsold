export type MarketState = "ACTIVE" | "NORMAL" | "THIN";

export type PriceState =
  | "COMPETITIVE"
  | "SLIGHTLY_HIGH"
  | "HIGH"
  | "UNKNOWN";

export type ReactionState =
  | "NO_INQUIRY"
  | "INQUIRY_NO_VISIT"
  | "VISIT_NO_NEGOTIATION"
  | "NEGOTIATION_NO_DEAL"
  | "REACTION_ACTIVE";

export type ListingStage =
  | "EARLY"
  | "WATCH"
  | "STALLED";

export type DecisionType =
  | "OBSERVE"
  | "KEEP"
  | "SMALL_ADJUST"
  | "STRONG_ADJUST"
  | "CHECK_OTHER";

export type ConfidenceLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface DecisionInput {
  daysListed: number;

  askingPrice: number;
  referenceTradePrice?: number | null;

  inquiries: number;
  visits: number;
  negotiations: number;

  recentTradeCount?: number | null;
  sameSizeTradeGapMonths?: number | null;
}

export interface DecisionEvidence {
  label: string;
  value: string;
  description: string;
}

export interface DecisionResult {
  decision: DecisionType;
  confidence: ConfidenceLevel;

  marketState: MarketState;
  priceState: PriceState;
  reactionState: ReactionState;
  listingStage: ListingStage;

  headline: string;
  evidences: DecisionEvidence[];
  actions: string[];
  nextReview: string;
}