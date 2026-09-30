"use client";

import { useEffect, useState } from "react";
import { evaluateDecision } from "../lib/decision/decision-engine";
import type { DecisionResult } from "../lib/decision/decision-types";

type FormState = {
  daysListed: string;
  inquiries: string;
  visits: string;
  negotiations: string;
};

type DecisionFormProps = {
  regionName: string;
  districtName: string;
  lawdCd: string;
  legalDong: string;

  askingPrice: string;
  referenceTradePrice: string;
  recentTradeCount: string;
  sameSizeTradeGapMonths: string;
  apartmentName: string;
  exclusiveArea: string;
};

const initialForm: FormState = {
  daysListed: "",
  inquiries: "0",
  visits: "0",
  negotiations: "0",
};

function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  const analyticsWindow = window as typeof window & {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number>
    ) => void;
  };

  if (typeof analyticsWindow.gtag !== "function") {
    return;
  }

  analyticsWindow.gtag("event", eventName, params);
}

function formatPrice(value: string) {
  const numericValue = Number(value);

  if (
    !Number.isFinite(numericValue) ||
    numericValue <= 0
  ) {
    return "확인되지 않음";
  }

  return `${numericValue.toLocaleString(
    "ko-KR"
  )}만원`;
}

function formatConfidence(
  confidence: DecisionResult["confidence"]
) {
  if (confidence === "HIGH") {
    return "높음";
  }

  if (confidence === "MEDIUM") {
    return "보통";
  }

  return "낮음";
}

export default function DecisionForm({
  regionName,
  districtName,
  lawdCd,
  legalDong,
  askingPrice,
  referenceTradePrice,
  recentTradeCount,
  sameSizeTradeGapMonths,
  apartmentName,
  exclusiveArea,
}: DecisionFormProps) {
  const [form, setForm] =
    useState<FormState>(initialForm);

  const [result, setResult] =
    useState<DecisionResult | null>(null);

  const [error, setError] =
    useState("");

  const numericAskingPrice =
    Number(askingPrice);

  const numericReferenceTradePrice =
    Number(referenceTradePrice);

  const numericRecentTradeCount =
    recentTradeCount.trim() === ""
      ? null
      : Number(recentTradeCount);

  const numericSameSizeTradeGapMonths =
    sameSizeTradeGapMonths.trim() === ""
      ? null
      : Number(sameSizeTradeGapMonths);

  const hasRequiredPriceData =
    Number.isFinite(numericAskingPrice) &&
    numericAskingPrice > 0;

  useEffect(() => {
    if (!hasRequiredPriceData) {
      return;
    }

    trackGaEvent("decision_page_view", {
      item_id: "DECISION",
      item_name: "현재 매도 상황 판단",
      apartment_name:
        apartmentName || "unknown",
      exclusive_area:
        exclusiveArea || "unknown",
    });
  }, [
    hasRequiredPriceData,
    apartmentName,
    exclusiveArea,
  ]);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setResult(null);
    setError("");
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const daysListed =
      Number(form.daysListed);

    const inquiries =
      Number(form.inquiries);

    const visits =
      Number(form.visits);

    const negotiations =
      Number(form.negotiations);

    if (!hasRequiredPriceData) {
      setError(
        "가격 확인 정보가 없습니다. 먼저 무료 가격 확인을 진행해주세요."
      );
      return;
    }

    if (
      !Number.isFinite(daysListed) ||
      daysListed < 0 ||
      !Number.isFinite(inquiries) ||
      inquiries < 0 ||
      !Number.isFinite(visits) ||
      visits < 0 ||
      !Number.isFinite(negotiations) ||
      negotiations < 0
    ) {
      setError(
        "매도 상황을 정확하게 입력해주세요."
      );
      return;
    }

    if (
      visits > inquiries ||
      negotiations > visits
    ) {
      setError(
        "방문 횟수는 문의 횟수보다 많을 수 없고, 협상 횟수는 방문 횟수보다 많을 수 없습니다."
      );
      return;
    }

    trackGaEvent("decision_submit", {
      item_id: "DECISION",
      item_name: "현재 매도 상황 판단",
      days_listed: daysListed,
      inquiries,
      visits,
      negotiations,
    });

    const nextResult =
      evaluateDecision({
        daysListed,
        askingPrice:
          numericAskingPrice,
        referenceTradePrice:
          Number.isFinite(
            numericReferenceTradePrice
          ) &&
          numericReferenceTradePrice > 0
            ? numericReferenceTradePrice
            : null,
        inquiries,
        visits,
        negotiations,
        recentTradeCount:
          numericRecentTradeCount !==
            null &&
          Number.isFinite(
            numericRecentTradeCount
          )
            ? numericRecentTradeCount
            : null,
        sameSizeTradeGapMonths:
          numericSameSizeTradeGapMonths !==
            null &&
          Number.isFinite(
            numericSameSizeTradeGapMonths
          )
            ? numericSameSizeTradeGapMonths
            : null,
      });

    trackGaEvent("decision_result_view", {
      item_id: "DECISION",
      item_name: "현재 매도 상황 판단",
      decision:
        nextResult.decision,
      confidence:
        nextResult.confidence,
      price_state:
        nextResult.priceState,
      market_state:
        nextResult.marketState,
      reaction_state:
        nextResult.reactionState,
      listing_stage:
        nextResult.listingStage,
    });

    setError("");
    setResult(nextResult);
  }

  if (!hasRequiredPriceData) {
    return (
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding:
            "64px 24px 100px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            color: "#176247",
          }}
        >
          현재 매도 상황 판단
        </p>

        <h1
          style={{
            margin: "10px 0 0",
            fontSize: 36,
            lineHeight: 1.25,
          }}
        >
          먼저 아파트 가격을
          <br />
          확인해주세요.
        </h1>

        <p
          style={{
            margin: "18px 0 0",
            color: "#626b66",
            lineHeight: 1.7,
          }}
        >
          가격 확인 결과를 기준으로
          현재 매도 상황을 함께
          판단합니다.
        </p>

        <a
          href="/free-price-check"
          style={{
            display: "inline-block",
            marginTop: 28,
            padding: "14px 18px",
            background: "#176247",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          무료 가격 확인하기 →
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding:
          "48px 24px 80px",
      }}
    >
      <section>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            color: "#176247",
          }}
        >
          현재 매도 상황 판단
        </p>

        <h1
          style={{
            margin: "10px 0 0",
            fontSize: 40,
            lineHeight: 1.2,
          }}
        >
          지금 가격을 유지할지,
          <br />
          조정할지 확인해보세요.
        </h1>

        <p
          style={{
            margin: "18px 0 0",
            color: "#626b66",
            lineHeight: 1.7,
          }}
        >
          가격 위치와 매도 기간,
          문의·방문 반응을 함께 살펴
          현재 우선 검토할 방향을
          확인합니다.
        </p>
      </section>

      <section
        style={{
          marginTop: 32,
          padding: 22,
          border:
            "1px solid #dfe5e1",
          background: "#f8fbf9",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            color: "#176247",
          }}
        >
          가격 확인 결과
        </p>

        {(apartmentName ||
          exclusiveArea) && (
          <h2
            style={{
              margin:
                "8px 0 18px",
              fontSize: 22,
            }}
          >
            {apartmentName ||
              "아파트"}
            {exclusiveArea
              ? ` · 전용 ${exclusiveArea}㎡`
              : ""}
          </h2>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 16,
              background: "#fff",
              border:
                "1px solid #e1e8e3",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: "#68736c",
              }}
            >
              현재 희망가격
            </span>

            <strong
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 19,
              }}
            >
              {formatPrice(
                askingPrice
              )}
            </strong>
          </div>

          <div
            style={{
              padding: 16,
              background: "#fff",
              border:
                "1px solid #e1e8e3",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: 12,
                color: "#68736c",
              }}
            >
              최근 동일 면적 실거래
            </span>

            <strong
              style={{
                display: "block",
                marginTop: 6,
                fontSize: 19,
              }}
            >
              {formatPrice(
                referenceTradePrice
              )}
            </strong>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 24,
          display: "grid",
          gap: 18,
          padding: 24,
          border:
            "1px solid #dfe5e1",
          background: "#fff",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
            }}
          >
            지금까지의 매도 상황을
            알려주세요.
          </h2>

          <p
            style={{
              margin:
                "8px 0 0",
              color: "#68736c",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            현재 매물이 시장에서
            어떤 반응을 받고 있는지
            함께 판단하는 데
            사용합니다.
          </p>
        </div>

        <Field
          label="매물 등록 후 경과일"
          value={
            form.daysListed
          }
          onChange={(value) =>
            updateField(
              "daysListed",
              value
            )
          }
          placeholder="예: 42"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <Field
            label="문의 횟수"
            value={
              form.inquiries
            }
            onChange={(value) =>
              updateField(
                "inquiries",
                value
              )
            }
          />

          <Field
            label="방문 횟수"
            value={form.visits}
            onChange={(value) =>
              updateField(
                "visits",
                value
              )
            }
          />

          <Field
            label="협상 횟수"
            value={
              form.negotiations
            }
            onChange={(value) =>
              updateField(
                "negotiations",
                value
              )
            }
          />
        </div>

        {error ? (
          <p
            style={{
              margin: 0,
              padding:
                "12px 14px",
              background:
                "#fff2ef",
              color: "#8b3024",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          style={{
            marginTop: 8,
            minHeight: 54,
            border: 0,
            background:
              "#176247",
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          지금 무엇을 해야 할지
          확인하기
        </button>
      </form>

      {result && (
        <section
          style={{
            marginTop: 36,
            padding: 28,
            border:
              "1px solid #d8e6da",
            background:
              "#f8fbf9",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 800,
              color: "#176247",
            }}
          >
            현재 판단
          </p>

          <h2
            style={{
              margin:
                "8px 0 0",
              fontSize: 28,
              lineHeight: 1.35,
            }}
          >
            {result.headline}
          </h2>

          <p
            style={{
              margin:
                "10px 0 0",
              color: "#68736c",
              fontSize: 13,
            }}
          >
            판단 참고도:{" "}
            {formatConfidence(
              result.confidence
            )}
          </p>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gap: 12,
            }}
          >
            {result.evidences.map(
              (evidence) => (
                <article
                  key={`${evidence.label}-${evidence.value}`}
                  style={{
                    padding: 16,
                    border:
                      "1px solid #e1e8e3",
                    background:
                      "#fff",
                  }}
                >
                  <strong>
                    {
                      evidence.label
                    }
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {
                      evidence.value
                    }
                  </p>

                  <p
                    style={{
                      margin:
                        "7px 0 0",
                      color:
                        "#68736c",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {
                      evidence.description
                    }
                  </p>
                </article>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 28,
            }}
          >
            <h3>
              지금 할 일
            </h3>

            <ol>
              {result.actions.map(
                (action) => (
                  <li
                    key={action}
                    style={{
                      marginTop: 8,
                      lineHeight: 1.6,
                    }}
                  >
                    {action}
                  </li>
                )
              )}
            </ol>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop:
                "1px solid #d8e2dc",
            }}
          >
            <strong>
              다음 재판단
            </strong>

            <p
              style={{
                margin:
                  "7px 0 0",
                color: "#556159",
              }}
            >
              {result.nextReview}
            </p>
          </div>

          <div
            style={{
              marginTop: 30,
              padding: 22,
              border:
                "1px solid #176247",
              background: "#fff",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                fontWeight: 800,
                color: "#176247",
              }}
            >
              더 자세히 확인하려면
            </p>

            <h3
              style={{
                margin:
                  "8px 0 0",
                fontSize: 20,
                lineHeight: 1.45,
              }}
            >
              왜 반응이 막혀 있는지
              <br />
              정체 원인을 더 자세히
              분석해보세요.
            </h3>

            <p
              style={{
                margin:
                  "10px 0 0",
                color: "#68736c",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              가격 위치와 거래 흐름,
              현재 매수 반응을 함께
              살펴 정체 가능성이 높은
              지점을 더 자세히
              확인합니다.
            </p>

            <a
              href={`/diagnosis?${new URLSearchParams({
                regionName,
                districtName,
                lawdCd,
                legalDong,

                askingPrice,
                referenceTradePrice,
                recentTradeCount,
                sameSizeTradeGapMonths,

                apartmentName,
                exclusiveArea: String(
                    Math.floor(Number(exclusiveArea))
                ),

                daysListed: form.daysListed,
                inquiries: form.inquiries,
                visits: form.visits,
                negotiations: form.negotiations,

                decision: result.decision,
              }).toString()}`}
              onClick={() =>
                trackGaEvent(
                  "decision_paid_cta_click",
                  {
                    item_id:
                      "DIAGNOSIS",
                    item_name:
                      "매도 정체 진단",
                    decision:
                      result.decision,
                    confidence:
                      result.confidence,
                    value: 9900,
                  }
                )
              }
              style={{
                display: "block",
                marginTop: 18,
                padding:
                  "15px 18px",
                background:
                  "#176247",
                color: "#fff",
                textAlign:
                  "center",
                textDecoration:
                  "none",
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              정체 원인 자세히
              분석하기 · 9,900원 →
            </a>
          </div>
        </section>
      )}

      <style jsx>{`
        @media (max-width: 680px) {
          div[style*="repeat(2"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 7,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {label}

      <input
        type="number"
        min="0"
        step="1"
        value={value}
        placeholder={
          placeholder
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={{
          width: "100%",
          minHeight: 46,
          padding: "0 12px",
          border:
            "1px solid #ccd5cf",
          fontSize: 15,
          boxSizing:
            "border-box",
        }}
      />
    </label>
  );
}