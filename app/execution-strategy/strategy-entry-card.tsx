"use client";

import {
  useState,
} from "react";

import type {
  Diagnosis,
} from "../report-types";

type StrategyEntryCardProps = {
  diagnosis: Diagnosis;
};

export default function StrategyEntryCard({
  diagnosis,
}: StrategyEntryCardProps) {
  const [
    error,
    setError,
  ] =
    useState("");

  function startStrategy() {
    const storageKey =
      `whyunsold:strategy-source:${diagnosis.reportId}`;

    const serializedDiagnosis =
      JSON.stringify(
        diagnosis
      );

    try {
      sessionStorage.setItem(
        storageKey,
        serializedDiagnosis
      );

      localStorage.setItem(
        storageKey,
        serializedDiagnosis
      );
    } catch {
      setError(
        "실행전략을 시작하기 위한 진단 정보를 저장하지 못했습니다."
      );
      return;
    }

    window.location.href =
      `/execution-strategy?reportId=${encodeURIComponent(
        diagnosis.reportId
      )}`;
  }

  return (
    <section
      className="strategy-entry-card"
      style={{
        marginTop: 28,
        padding: "32px",
        border: "1px solid #0b684d",
        background: "#eef4ef",
        color: "#17231d",
      }}
    >
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

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 28,
          marginTop: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            maxWidth: 680,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(26px, 4vw, 38px)",
              lineHeight: 1.25,
              letterSpacing: "-0.045em",
            }}
          >
            진단 결과를
            <br />
            30일 실행전략으로 바꾸세요.
          </h2>

          <p
            style={{
              margin: "16px 0 0",
              color: "#56675e",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            현재 리포트의 실행 요약을 매도 기한,
            가격 조정 범위와 노출 상태에 맞춘
            주차별 관찰·판단·행동 계획으로 확장합니다.
          </p>
        </div>

        <div
          style={{
            textAlign: "right",
          }}
        >
          <span
            style={{
              display: "block",
              color: "#68766e",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            30일 매도 실행전략
          </span>

          <strong
            style={{
              display: "block",
              marginTop: 5,
              fontSize: 28,
              letterSpacing: "-0.04em",
            }}
          >
            19,900원
          </strong>
        </div>
      </div>

      <ul
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "8px 24px",
          margin: "24px 0 0",
          paddingLeft: 20,
          color: "#43544a",
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <li>1주차부터 4주차까지의 실행표</li>
        <li>전략 유지·변경 조건</li>
        <li>매수 반응별 행동 분기</li>
        <li>변화 기록과 30일 종료 판단</li>
      </ul>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 26,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={
            startStrategy
          }
          style={{
            minHeight: 52,
            padding: "0 24px",
            border: 0,
            background: "#0b684d",
            color: "#fff",
            font: "inherit",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          30일 실행전략 만들기 →
        </button>

        <a
          href="/#application"
          style={{
            display: "inline-flex",
            minHeight: 52,
            padding: "0 20px",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #9ba9a1",
            color: "#31453a",
            fontSize: 13,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          다른 매물 진단하기
        </a>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            margin: "16px 0 0",
            color: "#a33a2b",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {error}
        </p>
      )}

      <style jsx>{`
        @media print {
          .strategy-entry-card {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}