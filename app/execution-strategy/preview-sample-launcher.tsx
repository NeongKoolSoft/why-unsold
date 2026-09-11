"use client";

import {
  useState,
} from "react";

import {
  PREVIEW_SAMPLE_DIAGNOSIS,
} from "./preview-sample";

export default function PreviewSampleLauncher() {
  const [
    error,
    setError,
  ] =
    useState("");

  function openSample() {
    const diagnosis =
      PREVIEW_SAMPLE_DIAGNOSIS;

    const storageKey =
      `whyunsold:strategy-source:${diagnosis.reportId}`;

    const serialized =
      JSON.stringify(
        diagnosis
      );

    try {
      sessionStorage.setItem(
        storageKey,
        serialized
      );

      localStorage.setItem(
        storageKey,
        serialized
      );
    } catch {
      setError(
        "Preview 샘플 정보를 저장하지 못했습니다."
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
      style={{
        width: "min(920px, calc(100% - 32px))",
        margin: "28px auto 0",
        padding: "18px 20px",
        border: "1px dashed #0b684d",
        background: "#eef4ef",
        color: "#31453a",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>
            Preview 화면 테스트
          </strong>

          <p
            style={{
              margin: "6px 0 0",
              color: "#66736c",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            실제 결제 없이 샘플 진단으로 입력 화면을 확인합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openSample
          }
          style={{
            minHeight: 44,
            padding: "0 18px",
            border: 0,
            background: "#0b684d",
            color: "#fff",
            font: "inherit",
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          샘플 진단으로 확인
        </button>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            margin: "12px 0 0",
            color: "#a33a2b",
            fontSize: 13,
          }}
        >
          {error}
        </p>
      )}
    </section>
  );
}