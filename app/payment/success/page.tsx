"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import DetailReport from "../../detail-report";
import StrategyEntryCard from "../../execution-strategy/strategy-entry-card";
import type {
  AiDetailAnalysis,
  Diagnosis,
} from "../../report-types";

type StoredOrder = {
  paymentId: string;
  amount: number;
  diagnosis: Diagnosis;
  orderToken: string;
  payMethod?: "CARD" | "TRANSFER";
  createdAt: string;
};

type ConfirmResponse = {
  ok?: boolean;
  analysisToken?: string;
  payment?: {
    paymentId?: string;
    transactionId?: string | null;
    status?: string;
    totalAmount?: number;
    currency?: string;
    method?: string | null;
    paidAt?: string | null;
  };
  error?: string;
  detail?: string;
};

type AnalysisResponse = {
  analysis?: AiDetailAnalysis;
  error?: string;
  detail?: string;
};

const REPORT_PRICE = 20000;

function PaymentSuccessContent() {
  const [
    status,
    setStatus,
  ] = useState<
    | "loading"
    | "success"
    | "error"
  >("loading");

  const [
    message,
    setMessage,
  ] = useState(
    "결제 상태를 확인하고 있습니다."
  );

  const [
    result,
    setResult,
  ] =
    useState<Diagnosis | null>(
      null
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<string | null>(
      null
    );

  const [
    paidDiagnosis,
    setPaidDiagnosis,
  ] =
    useState<Diagnosis | null>(
      null
    );

  const [
    paidAnalysisToken,
    setPaidAnalysisToken,
  ] =
    useState("");

  const [
    isAnalysisRetrying,
    setIsAnalysisRetrying,
  ] =
    useState(false);

  const [
    analysisFailedAfterPayment,
    setAnalysisFailedAfterPayment,
  ] =
    useState(false);

  const startedRef =
    useRef(false);

  async function runAnalysis(
    diagnosis: Diagnosis,
    paymentId: string,
    analysisToken: string
  ) {
    const cachedResultKey =
      `whyunsold:result:${paymentId}`;

    const analysisResponse =
      await fetch(
        "/api/analysis",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              diagnosis,
              paymentId,
              analysisToken,
            }),
          cache:
            "no-store",
        }
      );

    const analysisData =
      (await analysisResponse.json()) as AnalysisResponse;

    if (
      !analysisResponse.ok ||
      !analysisData.analysis
    ) {
      throw new Error(
        analysisData.detail ||
          analysisData.error ||
          "결제는 완료됐지만 분석 리포트 생성에 실패했습니다."
      );
    }

    const finalResult: Diagnosis =
      {
        ...diagnosis,
        aiDetailAnalysis:
          analysisData.analysis,
      };

    const serializedResult =
      JSON.stringify(
        finalResult
      );

    sessionStorage.setItem(
      cachedResultKey,
      serializedResult
    );

    localStorage.setItem(
      cachedResultKey,
      serializedResult
    );

    sessionStorage.removeItem(
      `whyunsold:order:${paymentId}`
    );

    localStorage.removeItem(
      `whyunsold:order:${paymentId}`
    );

    setResult(
      finalResult
    );

    setStatus(
      "success"
    );

    setMessage(
      "결제가 완료되었습니다."
    );

    setAnalysisFailedAfterPayment(
      false
    );
  }

  async function retryAnalysis() {
    if (
      !paidDiagnosis ||
      !paidAnalysisToken ||
      isAnalysisRetrying
    ) {
      return;
    }

    const searchParams =
      new URLSearchParams(
        window.location.search
      );

    const paymentId =
      searchParams.get(
        "paymentId"
      );

    if (!paymentId) {
      setMessage(
        "결제번호를 확인할 수 없습니다."
      );
      return;
    }

    setIsAnalysisRetrying(
      true
    );
    setStatus(
      "loading"
    );
    setMessage(
      "결제는 완료되었습니다. 매도 분석 리포트를 다시 생성하고 있습니다."
    );

    try {
      await runAnalysis(
        paidDiagnosis,
        paymentId,
        paidAnalysisToken
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "리포트 생성 중 오류가 발생했습니다.";

      setStatus(
        "error"
      );

      setMessage(
        errorMessage
      );

      setAnalysisFailedAfterPayment(
        true
      );
    } finally {
      setIsAnalysisRetrying(
        false
      );
    }
  }

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    async function completePayment() {
      const searchParams =
        new URLSearchParams(
          window.location.search
        );

      const paymentId =
        searchParams.get(
          "paymentId"
        );

      const paymentErrorCode =
        searchParams.get(
          "code"
        );

      const paymentErrorMessage =
        searchParams.get(
          "message"
        );

      if (!paymentId) {
        setStatus("error");
        setMessage(
          "결제 결과의 결제번호를 확인할 수 없습니다."
        );
        return;
      }

      if (paymentErrorCode) {
        sessionStorage.removeItem(
          `whyunsold:order:${paymentId}`
        );

        localStorage.removeItem(
          `whyunsold:order:${paymentId}`
        );

        setStatus("error");
        setMessage(
          paymentErrorMessage ||
            `결제가 완료되지 않았습니다. (${paymentErrorCode})`
        );
        return;
      }

      const storageKey =
        `whyunsold:order:${paymentId}`;

      const cachedResultKey =
        `whyunsold:result:${paymentId}`;

      const cachedResult =
        sessionStorage.getItem(
          cachedResultKey
        ) ??
        localStorage.getItem(
          cachedResultKey
        );

      if (cachedResult) {
        try {
          const parsed =
            JSON.parse(
              cachedResult
            ) as Diagnosis;

          setResult(parsed);
          setStatus("success");
          setMessage(
            "결제가 완료되었습니다."
          );
          return;
        } catch {
          sessionStorage.removeItem(
            cachedResultKey
          );

          localStorage.removeItem(
            cachedResultKey
          );
        }
      }

      const storedOrderRaw =
        sessionStorage.getItem(
          storageKey
        ) ??
        localStorage.getItem(
          storageKey
        );

      if (!storedOrderRaw) {
        setStatus("error");
        setMessage(
          "결제 전 분석 정보를 찾지 못했습니다. 결제를 시작한 브라우저로 돌아가 다시 확인해주세요."
        );
        return;
      }

      let storedOrder: StoredOrder;

      try {
        storedOrder =
          JSON.parse(
            storedOrderRaw
          ) as StoredOrder;
      } catch {
        sessionStorage.removeItem(
          storageKey
        );

        localStorage.removeItem(
          storageKey
        );

        setStatus("error");
        setMessage(
          "저장된 주문 정보를 읽지 못했습니다."
        );
        return;
      }

      if (
        storedOrder.paymentId !==
          paymentId ||
        storedOrder.amount !==
          REPORT_PRICE ||
        !storedOrder.diagnosis ||
        typeof storedOrder.orderToken !==
          "string" ||
        !storedOrder.orderToken
      ) {
        setStatus("error");
        setMessage(
          "저장된 결제 정보가 결제 결과와 일치하지 않습니다."
        );
        return;
      }

      try {
        setMessage(
          "결제 상태를 확인하고 있습니다."
        );

        const confirmResponse =
          await fetch(
            "/api/payment/confirm",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify({
                  paymentId,
                  orderToken:
                    storedOrder.orderToken,
                  diagnosis:
                    storedOrder.diagnosis,
                }),
              cache:
                "no-store",
            }
          );

        const confirmData =
          (await confirmResponse.json()) as ConfirmResponse;

        if (
          !confirmResponse.ok ||
          !confirmData.ok ||
          !confirmData.analysisToken
        ) {
          throw new Error(
            confirmData.detail ||
              confirmData.error ||
              "결제 상태 확인에 실패했습니다."
          );
        }

        setPaymentMethod(
          confirmData.payment
            ?.method ??
            null
        );

        setPaidDiagnosis(
          storedOrder.diagnosis
        );

        setPaidAnalysisToken(
          confirmData.analysisToken
        );

        setMessage(
          "결제가 완료되었습니다. 매도 분석 리포트를 생성하고 있습니다."
        );

        try {
          await runAnalysis(
            storedOrder.diagnosis,
            paymentId,
            confirmData.analysisToken
          );
        } catch (analysisError) {
          const analysisMessage =
            analysisError instanceof Error
              ? analysisError.message
              : "결제는 완료됐지만 분석 리포트 생성에 실패했습니다.";

          setStatus(
            "error"
          );

          setMessage(
            analysisMessage
          );

          setAnalysisFailedAfterPayment(
            true
          );

          return;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다.";

        setStatus(
          "error"
        );

        setMessage(
          errorMessage
        );
      }
    }

    void completePayment();
  }, []);

  if (
    status === "loading"
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
          padding:
            "40px 20px",
          background:
            "#f4f2ea",
          color:
            "#17231d",
        }}
      >
        <section
          style={{
            width:
              "min(680px, 100%)",
            padding:
              "48px",
            background:
              "#fff",
            border:
              "1px solid #d9ddd7",
            textAlign:
              "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color:
                "#0b684d",
              fontSize: 13,
              fontWeight:
                800,
              letterSpacing:
                "0.08em",
            }}
          >
            ANALYSIS REPORT
          </p>

          <h1
            className="payment-success-loading-title"
            style={{
              margin:
                "18px 0 0",
              fontSize:
                "clamp(28px, 4vw, 38px)",
              lineHeight:
                1.25,
              letterSpacing:
                "-0.04em",
            }}
          >
            <span>리포트를 생성하고</span>
            <span>있습니다.</span>
          </h1>

          <p
            className="payment-success-loading-description"
            style={{
              margin:
                "18px 0 0",
              color:
                "#66736c",
              fontSize: 15,
              lineHeight:
                1.8,
            }}
          >
            <span>{message}</span>
            <span>
              매도 상황을 분석하고 있으니 잠시만 기다려주세요.
            </span>
          </p>

          <style jsx>{`
            .payment-success-loading-title span,
            .payment-success-loading-description span {
              display: block;
            }

            @media (max-width: 680px) {
              .payment-success-loading-title {
                font-size: 30px !important;
                line-height: 1.35 !important;
              }

              .payment-success-loading-description {
                font-size: 14px !important;
                line-height: 1.75 !important;
              }

              .payment-success-loading-description span + span {
                margin-top: 8px;
              }
            }
          `}</style>
        </section>
      </main>
    );
  }

  if (
    status === "error" ||
    !result
  ) {
    return (
      <main
        style={{
          minHeight:
            "100vh",
          display:
            "grid",
          placeItems:
            "center",
          padding:
            "40px 20px",
          background:
            "#f4f2ea",
          color:
            "#17231d",
        }}
      >
        <section
          style={{
            width:
              "min(680px, 100%)",
            padding:
              "48px",
            background:
              "#fff",
            border:
              "1px solid #d9ddd7",
          }}
        >
          <p
            style={{
              margin: 0,
              color:
                "#a33a2b",
              fontSize: 13,
              fontWeight:
                800,
              letterSpacing:
                "0.08em",
            }}
          >
            {analysisFailedAfterPayment
              ? "ANALYSIS ERROR"
              : "PAYMENT ERROR"}
          </p>

          <h1
            style={{
              margin:
                "18px 0 0",
              fontSize:
                "clamp(30px, 5vw, 44px)",
              lineHeight:
                1.2,
              letterSpacing:
                "-0.04em",
            }}
          >
            {analysisFailedAfterPayment
              ? "결제는 완료됐지만 리포트를 생성하지 못했습니다."
              : "결제 처리를 완료하지 못했습니다."}
          </h1>

          <p
            style={{
              margin:
                "18px 0 0",
              color:
                "#66736c",
              fontSize: 15,
              lineHeight:
                1.8,
            }}
          >
            {message}
          </p>

          {analysisFailedAfterPayment ? (
            <button
              type="button"
              onClick={
                retryAnalysis
              }
              disabled={
                isAnalysisRetrying
              }
              style={{
                display:
                  "inline-flex",
                marginTop: 28,
                minHeight: 52,
                padding:
                  "0 24px",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                border: 0,
                background:
                  "#0b684d",
                color:
                  "#fff",
                font:
                  "inherit",
                fontWeight:
                  800,
                cursor:
                  isAnalysisRetrying
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  isAnalysisRetrying
                    ? 0.6
                    : 1,
              }}
            >
              {isAnalysisRetrying
                ? "리포트 다시 생성 중…"
                : "리포트 다시 생성하기"}
            </button>
          ) : (
            <a
              href="/#application"
              style={{
                display:
                  "inline-flex",
                marginTop: 28,
                minHeight: 52,
                padding:
                  "0 24px",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                background:
                  "#0b684d",
                color:
                  "#fff",
                textDecoration:
                  "none",
                fontWeight:
                  800,
              }}
            >
              입력 화면으로 돌아가기
            </a>
          )}

          <p
            style={{
              margin:
                "20px 0 0",
              color:
                "#7a857f",
              fontSize: 12,
              lineHeight:
                1.7,
            }}
          >
            {analysisFailedAfterPayment
              ? "다시 생성해도 리포트가 나오지 않으면 molip.help@gmail.com으로 문의해 주세요. 추가 결제는 필요하지 않습니다."
              : "결제가 완료된 것으로 보이는데 리포트가 생성되지 않았다면 molip.help@gmail.com으로 문의해 주세요."}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight:
          "100vh",
        background:
          "#f4f2ea",
      }}
    >
      <div
        style={{
          width:
            "min(1240px, calc(100% - 32px))",
          margin:
            "0 auto",
          padding:
            "28px 0 56px",
        }}
      >
        <div
          style={{
            marginBottom:
              24,
            padding:
              "18px 22px",
            background:
              "#eef4ef",
            border:
              "1px solid #cddbd1",
            color:
              "#31453a",
            fontSize: 13,
            lineHeight:
              1.7,
          }}
        >
          결제가 정상적으로 완료되었습니다.
          {paymentMethod
            ? ` 결제수단: ${paymentMethod}.`
            : ""}
          {" "}
          아래에서 생성된 매도 분석
          리포트를 확인할 수 있습니다.
        </div>

        <DetailReport
          result={result}
          onBack={() => {
            window.location.href =
              "/";
          }}
          onEdit={() => {
            window.location.href =
              "/#application";
          }}
        />

        <StrategyEntryCard
          diagnosis={result}
        />
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight:
              "100vh",
            display:
              "grid",
            placeItems:
              "center",
            background:
              "#f4f2ea",
          }}
        >
          결제 결과를 확인하고
          있습니다.
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
