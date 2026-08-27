"use client";

import type {
  CSSProperties,
  FormEvent,
} from "react";

import {
  useEffect,
  useState,
} from "react";

import type {
  Diagnosis,
} from "../report-types";

import type {
  ExecutionStrategyInput,
  ListingExposureStatus,
  ListingQualityStatus,
  PriceAdjustmentRange,
  SaleDeadline,
} from "../execution-strategy-types";

import {
  EXECUTION_STRATEGY_PRODUCT,
} from "../lib/execution-strategy-config";

import {
  isDiagnosisForStrategy,
  isExecutionStrategyInput,
  validateExecutionStrategyConstraints,
} from "../lib/execution-strategy-validation";

import ExecutionStrategyPayment from "./execution-strategy-payment";

const pageStyle: CSSProperties = {
  width: "min(920px, calc(100% - 32px))",
  margin: "0 auto",
  padding: "64px 0 96px",
};

const sectionStyle: CSSProperties = {
  marginTop: 28,
  padding: "28px",
  border: "1px solid #d3d9d4",
  background: "#fff",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 20,
};

const labelStyle: CSSProperties = {
  display: "block",
  color: "#24352c",
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.5,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 48,
  marginTop: 9,
  padding: "0 14px",
  border: "1px solid #c9d1cc",
  borderRadius: 0,
  background: "#fff",
  color: "#17231d",
  font: "inherit",
  boxSizing: "border-box",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 120,
  padding: 14,
  resize: "vertical",
  lineHeight: 1.7,
};

const helpStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#6d7972",
  fontSize: 12,
  lineHeight: 1.6,
};

function formatWon(
  value: number
) {
  if (value >= 10000) {
    const eok =
      Math.floor(
        value / 10000
      );

    const remainder =
      value % 10000;

    return remainder === 0
      ? `${eok}억원`
      : `${eok}억 ${remainder.toLocaleString(
          "ko-KR"
        )}만원`;
  }

  return `${value.toLocaleString(
    "ko-KR"
  )}만원`;
}

function optionalInteger(
  value: FormDataEntryValue | null
) {
  const text =
    String(value ?? "")
      .trim();

  if (!text) {
    return undefined;
  }

  const number =
    Number(text);

  return Number.isInteger(number)
    ? number
    : Number.NaN;
}

export default function ExecutionStrategyForm() {
  const [
    diagnosis,
    setDiagnosis,
  ] =
    useState<Diagnosis | null>(
      null
    );

  const [
    status,
    setStatus,
  ] =
    useState<
      "loading" |
      "ready" |
      "error"
    >("loading");

  const [
    message,
    setMessage,
  ] =
    useState(
      "매도진단 결과를 불러오고 있습니다."
    );

  const [
    confirmedInput,
    setConfirmedInput,
  ] =
    useState<ExecutionStrategyInput | null>(
      null
    );

  useEffect(() => {
    const searchParams =
      new URLSearchParams(
        window.location.search
      );

    const reportId =
      searchParams.get(
        "reportId"
      )?.trim();

    if (!reportId) {
      setStatus("error");
      setMessage(
        "연결된 매도진단 번호를 확인할 수 없습니다."
      );
      return;
    }

    const storageKey =
      `whyunsold:strategy-source:${reportId}`;

    const storedSource =
      sessionStorage.getItem(
        storageKey
      ) ??
      localStorage.getItem(
        storageKey
      );

    if (!storedSource) {
      setStatus("error");
      setMessage(
        "매도진단 결과를 찾지 못했습니다. 리포트를 생성한 브라우저에서 다시 진행해주세요."
      );
      return;
    }

    try {
      const parsed =
        JSON.parse(
          storedSource
        ) as unknown;

      if (
        !isDiagnosisForStrategy(
          parsed
        )
      ) {
        throw new Error(
          "저장된 진단 결과의 형식이 올바르지 않습니다."
        );
      }

      if (
        parsed.reportId !==
          reportId
      ) {
        throw new Error(
          "연결된 진단 번호가 일치하지 않습니다."
        );
      }

      setDiagnosis(parsed);
      setStatus("ready");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "저장된 진단 결과를 읽지 못했습니다."
      );
    }
  }, []);

  function confirmInput(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!diagnosis) {
      return;
    }

    const form =
      new FormData(
        event.currentTarget
      );

    const brokerCount =
      Number(
        form.get(
          "brokerCount"
        )
      );

    const minimumAcceptablePrice =
      optionalInteger(
        form.get(
          "minimumAcceptablePrice"
        )
      );

    const competitorListingCount =
      optionalInteger(
        form.get(
          "competitorListingCount"
        )
      );

    const repeatedFeedback =
      String(
        form.get(
          "repeatedFeedback"
        ) ?? ""
      ).trim();

    const saleConstraints =
      String(
        form.get(
          "saleConstraints"
        ) ?? ""
      ).trim();

    const executionInput: ExecutionStrategyInput = {
      saleDeadline:
        String(
          form.get(
            "saleDeadline"
          )
        ) as SaleDeadline,

      priceAdjustmentRange:
        String(
          form.get(
            "priceAdjustmentRange"
          )
        ) as PriceAdjustmentRange,

      ...(minimumAcceptablePrice ===
        undefined
        ? {}
        : {
            minimumAcceptablePrice,
          }),

      brokerCount,

      ...(competitorListingCount ===
        undefined
        ? {}
        : {
            competitorListingCount,
          }),

      listingExposureStatus:
        String(
          form.get(
            "listingExposureStatus"
          )
        ) as ListingExposureStatus,

      listingQualityStatus:
        String(
          form.get(
            "listingQualityStatus"
          )
        ) as ListingQualityStatus,

      ...(repeatedFeedback
        ? {
            repeatedFeedback,
          }
        : {}),

      ...(saleConstraints
        ? {
            saleConstraints,
          }
        : {}),
    };

    if (
      !isExecutionStrategyInput(
        executionInput
      )
    ) {
      setConfirmedInput(null);
      setMessage(
        "입력값을 확인해주세요. 횟수와 가격은 0 이상의 정수로 입력해야 합니다."
      );
      return;
    }

    const constraintError =
      validateExecutionStrategyConstraints(
        diagnosis,
        executionInput
      );

    if (constraintError) {
      setConfirmedInput(null);
      setMessage(
        constraintError
      );
      return;
    }

    setMessage("");
    setConfirmedInput(
      executionInput
    );

    window.setTimeout(
      () =>
        document
          .getElementById(
            "strategy-payment-preview"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
      0
    );
  }

  if (
    status === "loading"
  ) {
    return (
      <section style={pageStyle}>
        <div style={sectionStyle}>
          <p
            style={{
              margin: 0,
              color: "#0b684d",
              fontWeight: 800,
            }}
          >
            {message}
          </p>
        </div>
      </section>
    );
  }

  if (
    status === "error" ||
    !diagnosis
  ) {
    return (
      <section style={pageStyle}>
        <div style={sectionStyle}>
          <p
            style={{
              margin: 0,
              color: "#a33a2b",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            SOURCE ERROR
          </p>

          <h1
            style={{
              margin: "16px 0 0",
              fontSize: "clamp(28px, 5vw, 42px)",
              lineHeight: 1.25,
              letterSpacing: "-0.04em",
            }}
          >
            매도진단 결과를 불러오지 못했습니다.
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              color: "#66736c",
              lineHeight: 1.8,
            }}
          >
            {message}
          </p>

          <a
            href="/#application"
            style={{
              display: "inline-flex",
              minHeight: 50,
              marginTop: 26,
              padding: "0 22px",
              alignItems: "center",
              justifyContent: "center",
              background: "#0b684d",
              color: "#fff",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            다른 매물 진단하기
          </a>
        </div>
      </section>
    );
  }

  return (
    <section style={pageStyle}>
      <header>
        <p
          style={{
            margin: 0,
            color: "#0b684d",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          30 DAY ACTION
        </p>

        <h1
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(36px, 6vw, 58px)",
            lineHeight: 1.12,
            letterSpacing: "-0.055em",
          }}
        >
          진단 결과를
          <br />
          30일 실행전략으로 바꿉니다.
        </h1>

        <p
          style={{
            maxWidth: 680,
            margin: "22px 0 0",
            color: "#607069",
            fontSize: 15,
            lineHeight: 1.85,
          }}
        >
          매도 기한과 가격 조정 범위, 현재 노출 상태를
          추가하면 주차별 관찰·판단·행동 계획을 만듭니다.
        </p>
      </header>

      <section style={sectionStyle}>
        <p
          style={{
            margin: 0,
            color: "#738078",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          대상 매물
        </p>

        <h2
          style={{
            margin: "12px 0 0",
            fontSize: 25,
            letterSpacing: "-0.035em",
          }}
        >
          {diagnosis.apartmentName}
        </h2>

        <p
          style={{
            margin: "10px 0 0",
            color: "#5f6d65",
            lineHeight: 1.7,
          }}
        >
          {diagnosis.complex}
          <br />
          {diagnosis.area} · 현재 희망가{" "}
          {diagnosis.askingPrice}
        </p>

        <div
          style={{
            marginTop: 20,
            padding: "16px 18px",
            background: "#eef4ef",
            color: "#31453a",
            lineHeight: 1.7,
          }}
        >
          <strong>
            현재 핵심 병목
          </strong>
          <br />
          {diagnosis.aiDetailAnalysis
            ?.bottleneckAnalysis.label ??
            diagnosis.label}
        </div>
      </section>

      <form
        onSubmit={confirmInput}
      >
        <section style={sectionStyle}>
          <h2
            style={{
              margin: 0,
              fontSize: 23,
              letterSpacing: "-0.035em",
            }}
          >
            1. 목표와 가격 조건
          </h2>

          <div
            style={{
              ...gridStyle,
              marginTop: 24,
            }}
          >
            <label style={labelStyle}>
              목표 매도 기한
              <select
                name="saleDeadline"
                required
                defaultValue="within_60_days"
                style={inputStyle}
              >
                <option value="within_30_days">
                  30일 이내
                </option>
                <option value="within_60_days">
                  60일 이내
                </option>
                <option value="within_90_days">
                  90일 이내
                </option>
                <option value="flexible">
                  기한보다 가격 우선
                </option>
              </select>
            </label>

            <label style={labelStyle}>
              가격 조정 가능 범위
              <select
                name="priceAdjustmentRange"
                required
                defaultValue="undecided"
                style={inputStyle}
              >
                <option value="maintain">
                  현재 가격 유지
                </option>
                <option value="within_3_percent">
                  3% 이내 조정 가능
                </option>
                <option value="within_5_percent">
                  5% 이내 조정 가능
                </option>
                <option value="over_5_percent">
                  5% 초과도 검토 가능
                </option>
                <option value="undecided">
                  아직 결정하지 못함
                </option>
              </select>
            </label>

            <label style={labelStyle}>
              최저 수용 가능 가격
              <input
                name="minimumAcceptablePrice"
                type="number"
                min="1"
                step="1"
                placeholder="선택 입력"
                style={inputStyle}
              />
              <p style={helpStyle}>
                만원 단위 · 현재 희망가{" "}
                {formatWon(
                  diagnosis.metrics.askingPrice
                )}
              </p>
            </label>

            <label style={labelStyle}>
              현재 확인한 경쟁 매물 수
              <input
                name="competitorListingCount"
                type="number"
                min="0"
                max="1000"
                step="1"
                placeholder="선택 입력"
                style={inputStyle}
              />
              <p style={helpStyle}>
                같은 단지·유사 면적 기준
              </p>
            </label>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2
            style={{
              margin: 0,
              fontSize: 23,
              letterSpacing: "-0.035em",
            }}
          >
            2. 노출과 중개 상태
          </h2>

          <div
            style={{
              ...gridStyle,
              marginTop: 24,
            }}
          >
            <label style={labelStyle}>
              의뢰 중개업소 수
              <input
                name="brokerCount"
                type="number"
                min="0"
                max="100"
                step="1"
                required
                defaultValue="1"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              포털 노출 확인 상태
              <select
                name="listingExposureStatus"
                required
                defaultValue="not_checked"
                style={inputStyle}
              >
                <option value="not_checked">
                  아직 직접 확인하지 않음
                </option>
                <option value="limited">
                  일부만 노출되거나 정보가 부족함
                </option>
                <option value="sufficient">
                  주요 포털 노출을 확인함
                </option>
                <option value="unknown">
                  잘 모르겠음
                </option>
              </select>
            </label>

            <label style={labelStyle}>
              사진·매물 설명 상태
              <select
                name="listingQualityStatus"
                required
                defaultValue="unknown"
                style={inputStyle}
              >
                <option value="needs_improvement">
                  보완이 필요함
                </option>
                <option value="average">
                  일반적인 수준
                </option>
                <option value="good">
                  충분히 정리되어 있음
                </option>
                <option value="unknown">
                  잘 모르겠음
                </option>
              </select>
            </label>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2
            style={{
              margin: 0,
              fontSize: 23,
              letterSpacing: "-0.035em",
            }}
          >
            3. 실제 반응과 제약조건
          </h2>

          <div
            style={{
              display: "grid",
              gap: 20,
              marginTop: 24,
            }}
          >
            <label style={labelStyle}>
              반복된 문의·방문 거절 내용
              <textarea
                name="repeatedFeedback"
                maxLength={1000}
                placeholder="예: 입주 가능일을 자주 묻지만 방문으로 이어지지 않음"
                style={textareaStyle}
              />
              <p style={helpStyle}>
                확인한 내용만 입력하고 추측은 제외해주세요.
              </p>
            </label>

            <label style={labelStyle}>
              반드시 지켜야 할 매도 조건
              <textarea
                name="saleConstraints"
                maxLength={1000}
                placeholder="예: 특정 날짜 이후 입주 가능, 가격 외 조건 협의 가능"
                style={textareaStyle}
              />
            </label>
          </div>
        </section>

        {message && (
          <p
            role="alert"
            style={{
              margin: "20px 0 0",
              padding: "16px 18px",
              border: "1px solid #d9b6ad",
              background: "#fff5f2",
              color: "#9a382b",
              lineHeight: 1.7,
            }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            minHeight: 58,
            marginTop: 28,
            border: 0,
            background: "#0b684d",
            color: "#fff",
            font: "inherit",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          입력 내용 확인하기 →
        </button>
      </form>

      {confirmedInput && (
        <section
          id="strategy-payment-preview"
          style={{
            ...sectionStyle,
            borderColor: "#0b684d",
            background: "#eef4ef",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#0b684d",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            입력 확인 완료
          </p>

          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 25,
              }}
            >
              30일 매도 실행전략
            </h2>

            <strong
              style={{
                fontSize: 28,
                letterSpacing: "-0.04em",
              }}
            >
              {EXECUTION_STRATEGY_PRODUCT
                .price
                .toLocaleString(
                  "ko-KR"
                )}
              원
            </strong>
          </div>

          <ul
            style={{
              margin: "20px 0 0",
              paddingLeft: 20,
              color: "#46564d",
              lineHeight: 1.9,
            }}
          >
            <li>권장 전략과 유지·변경 조건</li>
            <li>1주차부터 4주차까지의 실행표</li>
            <li>매수 반응별 행동 분기</li>
            <li>실전 점검표와 변화 기록표</li>
            <li>30일 종료 판단 기준</li>
          </ul>

          <ExecutionStrategyPayment
            diagnosis={
              diagnosis
            }
            executionInput={
              confirmedInput
            }
          />
        </section>
      )}
    </section>
  );
}