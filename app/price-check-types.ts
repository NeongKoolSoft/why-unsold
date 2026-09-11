export type PriceCheckPosition =
  | "below-market"
  | "competitive"
  | "near-market"
  | "review-needed"
  | "high"
  | "stale-data";

export type PriceCheckTransaction = {
  apartmentName: string;
  legalDong: string;
  jibun: string;
  exclusiveArea: number;
  dealAmount: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  floor: number;
  buildYear: number;
};

export type PriceCheckOrderData = {
  productId:
    "price-check";

  property: {
    regionName: string;
    districtName: string;
    lawdCd: string;
    legalDong: string;
    apartmentName: string;
    exclusiveArea: number;
    askingPrice: number;
  };

  market: {
    dataDate: string;
    districtTotalCount12m: number;
    complexTransactionCount12m: number;
    sameAreaTransactionCount12m: number;
    latestTradePrice:
      | number
      | null;
    monthsSinceLastTrade:
      | number
      | null;

    latestTransaction:
      | PriceCheckTransaction
      | null;

    sameAreaTransactions12m:
      PriceCheckTransaction[];
  };
};

export type PriceCheckEvidence = {
  label: string;
  value: string;
  description: string;
};

export type PriceCheckReport = {
  reportId: string;
  createdAt: string;
  dataDate: string;

  property: {
    regionName: string;
    districtName: string;
    legalDong: string;
    apartmentName: string;
    exclusiveArea: number;
    askingPrice: number;
  };

  judgment: {
    position:
      PriceCheckPosition;
    label: string;
    headline: string;
    summary: string;
  };

  metrics: {
    askingPrice: number;

    latestTradePrice:
      | number
      | null;

    priceDifference:
      | number
      | null;

    priceGapPercent:
      | number
      | null;

    complexTransactionCount12m:
      number;

    sameAreaTransactionCount12m:
      number;

    monthsSinceLastTrade:
      | number
      | null;
  };

  evidence:
    PriceCheckEvidence[];

  checkpoints: string[];

  limitations: string[];
};