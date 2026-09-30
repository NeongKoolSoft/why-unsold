import { evaluateDecision } from "./decision-engine";

const cases = [
  {
    name: "OBSERVE",
    input: {
      daysListed: 7,
      askingPrice: 50000,
      referenceTradePrice: 49000,
      inquiries: 0,
      visits: 0,
      negotiations: 0,
      recentTradeCount: 3,
      sameSizeTradeGapMonths: 2,
    },
  },
  {
    name: "KEEP",
    input: {
      daysListed: 20,
      askingPrice: 50000,
      referenceTradePrice: 49500,
      inquiries: 5,
      visits: 2,
      negotiations: 1,
      recentTradeCount: 4,
      sameSizeTradeGapMonths: 2,
    },
  },
  {
    name: "SMALL_ADJUST",
    input: {
      daysListed: 42,
      askingPrice: 53000,
      referenceTradePrice: 50000,
      inquiries: 1,
      visits: 0,
      negotiations: 0,
      recentTradeCount: 4,
      sameSizeTradeGapMonths: 3,
    },
  },
  {
    name: "STRONG_ADJUST",
    input: {
      daysListed: 65,
      askingPrice: 56000,
      referenceTradePrice: 50000,
      inquiries: 0,
      visits: 0,
      negotiations: 0,
      recentTradeCount: 5,
      sameSizeTradeGapMonths: 2,
    },
  },
  {
    name: "CHECK_OTHER",
    input: {
      daysListed: 40,
      askingPrice: 50500,
      referenceTradePrice: 50000,
      inquiries: 0,
      visits: 0,
      negotiations: 0,
      recentTradeCount: 4,
      sameSizeTradeGapMonths: 2,
    },
  },
];

for (const testCase of cases) {
  const result = evaluateDecision(testCase.input);

  console.log(
    testCase.name,
    "=>",
    result.decision,
    result.priceState,
    result.reactionState,
    result.marketState
  );
}