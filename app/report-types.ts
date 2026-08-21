export type Cause =
  | "price"
  | "liquidity"
  | "exposure"
  | "conversion"
  | "condition";

export type ReportEvidence = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export type AiAnalysisSection = {
  title: string;
  summary: string;
  details: string[];
};

export type AiBottleneckAnalysis = {
  primary: Cause;
  label: string;
  reason: string;
  supportingSignals: string[];
  uncertainties: string[];
};

export type AiPriceScenario = {
  type: "maintain" | "adjust_small" | "adjust_active";
  label: string;
  description: string;
  suitableWhen: string[];
  risks: string[];
  checkpoints: string[];
};

export type AiActionPlanItem = {
  period: "1-7" | "8-14" | "15-30";
  title: string;
  actions: string[];
  decisionCriteria: string[];
};

export type AiDecisionTrigger = {
  type: "maintain" | "adjust" | "reassess";
  title: string;
  condition: string;
  action: string;
};

export type AiDetailAnalysis = {
  executiveDiagnosis: {
    headline: string;
    summary: string;
    keyReason: string;
  };

  priceAnalysis: AiAnalysisSection;

  liquidityAnalysis: AiAnalysisSection;

  marketInterpretation: AiAnalysisSection;

  bottleneckAnalysis: AiBottleneckAnalysis;

  priceScenarios: AiPriceScenario[];

  actionPlan30Days: AiActionPlanItem[];

  decisionTriggers: AiDecisionTrigger[];

  finalStrategy: {
    headline: string;
    summary: string;
    priorities: string[];
  };

  limitations: string[];
};

export type Diagnosis = {
  cause: Cause;
  label: string;
  headline: string;
  summary: string;
  complex: string;
  apartmentName: string;
  area: string;
  askingPrice: string;
  listedAt: string;
  reportId: string;
  createdAt: string;
  dataDate: string;

  highlights: {
    value: string;
    label: string;
  }[];

  evidence: ReportEvidence[];

  actionTitle: string;
  actionDescription: string;

  metrics: {
    askingPrice: number;
    latestTradePrice: number;
    lowestListingPrice: number;
    tradeGapPercent: number;
    listingGapPercent: number;
    complexTransactionCount12m: number;
    sameAreaTransactionCount12m: number;
    monthsSinceLastTrade: number;
    households: number | null;
    listedDays: number;
    inquiries: number | null;
    visits: number | null;
    offers: number | null;
  };

  aiDetailAnalysis?: AiDetailAnalysis;
};