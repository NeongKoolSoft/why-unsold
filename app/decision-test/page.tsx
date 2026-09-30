import { evaluateDecision } from "../lib/decision/decision-engine";

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

export default function DecisionTestPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 32 }}>
        V3 Decision Engine Test
      </h1>

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        {cases.map((testCase) => {
          const result = evaluateDecision(testCase.input);

          return (
            <section
              key={testCase.name}
              style={{
                border: "1px solid #ddd",
                padding: 20,
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                기대값: {testCase.name}
              </h2>

              <p>
                실제 결과:{" "}
                <strong>{result.decision}</strong>
              </p>

              <ul>
                <li>
                  priceState: {result.priceState}
                </li>
                <li>
                  reactionState: {result.reactionState}
                </li>
                <li>
                  marketState: {result.marketState}
                </li>
                <li>
                  listingStage: {result.listingStage}
                </li>
                <li>
                  confidence: {result.confidence}
                </li>
              </ul>

              <div style={{ marginTop: 24 }}>
                <p
                  style={{
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  현재 판단
                </p>

                <p>{result.headline}</p>
              </div>

              <div style={{ marginTop: 20 }}>
                <p
                  style={{
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  판단 근거
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {result.evidences.map(
                    (evidence) => (
                      <div
                        key={`${evidence.label}-${evidence.value}`}
                        style={{
                          padding: 12,
                          border:
                            "1px solid #e5e5e5",
                          background: "#fafafa",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontWeight: 700,
                          }}
                        >
                          {evidence.label}
                        </p>

                        <p
                          style={{
                            margin: "4px 0 0",
                          }}
                        >
                          {evidence.value}
                        </p>

                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 14,
                            color: "#666",
                          }}
                        >
                          {evidence.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <p
                  style={{
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  지금 할 일
                </p>

                <ul>
                  {result.actions.map((action) => (
                    <li key={action}>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 20 }}>
                <p
                  style={{
                    marginBottom: 8,
                    fontWeight: 700,
                  }}
                >
                  다음 재판단
                </p>

                <p>{result.nextReview}</p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}