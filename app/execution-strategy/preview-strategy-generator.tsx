"use client";

import {
  useState,
} from "react";

import type {
  ExecutionStrategy,
  ExecutionStrategyInput,
} from "../execution-strategy-types";

import type {
  Diagnosis,
} from "../report-types";

type PreviewStrategyGeneratorProps = {
  diagnosis:
    Diagnosis;

  executionInput:
    ExecutionStrategyInput;
};

type StrategyResponse = {
  strategy?:
    ExecutionStrategy;

  error?: string;

  detail?: string;
};

const PREVIEW_REPORT_ID =
  "PREVIEW-SAMPLE-001";

export default function PreviewStrategyGenerator({
  diagnosis,
  executionInput,
}: PreviewStrategyGeneratorProps) {
  const [
    isGenerating,
    setIsGenerating,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  if (
    diagnosis.reportId !==
      PREVIEW_REPORT_ID
  ) {
    return null;
  }

  async function generatePreviewStrategy() {
    if (
      isGenerating
    ) {
      return;
    }

    setIsGenerating(
      true
    );

    setError("");

    try {
      const response =
        await fetch(
          "/api/execution-strategy",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              "x-whyunsold-strategy-local-recovery":
                "1",
            },

            body:
              JSON.stringify({
                diagnosis,

                executionInput,
              }),

            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as
          StrategyResponse;

      if (
        !response.ok ||
        !data.strategy
      ) {
        throw new Error(
          data.detail ||
            data.error ||
            "Preview 실행전략을 생성하지 못했습니다."
        );
      }

      const strategy =
        data.strategy;

      const serialized =
        JSON.stringify(
          strategy
        );

      const resultKey =
        `whyunsold:strategy-result:${PREVIEW_REPORT_ID}`;

      const strategyKey =
        `whyunsold:strategy:${strategy.strategyId}`;

      sessionStorage.setItem(
        resultKey,
        serialized
      );

      localStorage.setItem(
        resultKey,
        serialized
      );

      sessionStorage.setItem(
        strategyKey,
        serialized
      );

      localStorage.setItem(
        strategyKey,
        serialized
      );

      window.location.href =
        `/execution-strategy/success?paymentId=${encodeURIComponent(
          PREVIEW_REPORT_ID
        )}`;
    } catch (generationError) {
      setError(
        generationError instanceof
          Error
          ? generationError.message
          : "Preview 실행전략 생성 중 오류가 발생했습니다."
      );

      setIsGenerating(
        false
      );
    }
  }

  return (
    <section
      style={{
        marginTop:
          22,
        padding:
          "18px",
        border:
          "1px dashed #0b684d",
        background:
          "#fff",
      }}
    >
      <p
        style={{
          margin:
            0,
          color:
            "#0b684d",
          fontSize:
            11,
          fontWeight:
            900,
          letterSpacing:
            "0.08em",
        }}
      >
        PREVIEW ONLY
      </p>

      <p
        style={{
          margin:
            "8px 0 0",
          color:
            "#58675f",
          fontSize:
            13,
          lineHeight:
            1.7,
        }}
      >
        샘플 진단으로 결제 이후의 실행전략 생성과
        7페이지 결과 화면을 확인합니다.
      </p>

      <button
        type="button"
        onClick={
          generatePreviewStrategy
        }
        disabled={
          isGenerating
        }
        style={{
          width:
            "100%",
          minHeight:
            50,
          marginTop:
            14,
          border:
            "1px solid #0b684d",
          background:
            "#fff",
          color:
            "#0b684d",
          font:
            "inherit",
          fontWeight:
            800,
          cursor:
            isGenerating
              ? "not-allowed"
              : "pointer",
          opacity:
            isGenerating
              ? 0.65
              : 1,
        }}
      >
        {isGenerating
          ? "샘플 실행전략 생성 중…"
          : "결제 없이 결과 테스트 →"}
      </button>

      {error && (
        <p
          role="alert"
          style={{
            margin:
              "12px 0 0",
            padding:
              "12px 14px",
            border:
              "1px solid #d9b6ad",
            background:
              "#fff5f2",
            color:
              "#9a382b",
            fontSize:
              12,
            lineHeight:
              1.7,
          }}
        >
          {error}
        </p>
      )}
    </section>
  );
}