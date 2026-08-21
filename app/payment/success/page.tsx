"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import DetailReport from "../../detail-report";
import type {
  AiDetailAnalysis,
  Diagnosis,
} from "../../report-types";

type StoredOrder = {
  orderId: string;
  amount: number;
  diagnosis: Diagnosis;
  createdAt: string;
};

type ConfirmResponse = {
  ok?: boolean;
  payment?: {
    paymentKey?: string;
    orderId?: string;
    status?: string;
    totalAmount?: number;
    method?: string | null;
    approvedAt?: string | null;
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
    "결제 승인을 확인하고 있습니다."
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

  const startedRef =
    useRef(false);

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

      const paymentKey =
        searchParams.get(
          "paymentKey"
        );

      const orderId =
        searchParams.get(
          "orderId"
        );

      const amount =
        Number(
          searchParams.get(
            "amount"
          )
        );

      if (
        !paymentKey ||
        !orderId ||
        !Number.isFinite(amount)
      ) {
        setStatus("error");
        setMessage(
          "결제 결과 정보가 올바르지 않습니다."
        );
        return;
      }

      if (
        amount !== REPORT_PRICE
      ) {
        setStatus("error");
        setMessage(
          "결제 금액이 올바르지 않습니다."
        );
        return;
      }

      const storageKey =
        `whyunsold:order:${orderId}`;

      const cachedResultKey =
        `whyunsold:result:${orderId}`;

      const cachedResult =
        sessionStorage.getItem(
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
        }
      }

      const storedOrderRaw =
        sessionStorage.getItem(
          storageKey
        );

      if (!storedOrderRaw) {
        setStatus("error");
        setMessage(
          "결제 전 분석 정보를 찾지 못했습니다. 같은 브라우저에서 다시 진행해주세요."
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
        setStatus("error");
        setMessage(
          "저장된 주문 정보를 읽지 못했습니다."
        );
        return;
      }

      if (
        storedOrder.orderId !==
          orderId ||
        storedOrder.amount !==
          REPORT_PRICE ||
        !storedOrder.diagnosis
      ) {
        setStatus("error");
        setMessage(
          "주문 정보가 결제 결과와 일치하지 않습니다."
        );
        return;
      }

      try {
        setMessage(
          "결제를 승인하고 있습니다."
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
                  paymentKey,
                  orderId,
                  amount,
                }),
              cache:
                "no-store",
            }
          );

        const confirmData =
          (await confirmResponse.json()) as ConfirmResponse;

        if (
          !confirmResponse.ok ||
          !confirmData.ok
        ) {
          throw new Error(
            confirmData.detail ||
              confirmData.error ||
              "결제 승인에 실패했습니다."
          );
        }

        setPaymentMethod(
          confirmData.payment
            ?.method ??
            null
        );

        setMessage(
          "결제가 완료되었습니다. 매도 분석 리포트를 생성하고 있습니다."
        );

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
                  diagnosis:
                    storedOrder.diagnosis,
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
            ...storedOrder.diagnosis,
            aiDetailAnalysis:
              analysisData.analysis,
          };

        sessionStorage.setItem(
          cachedResultKey,
          JSON.stringify(
            finalResult
          )
        );

        sessionStorage.removeItem(
          storageKey
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
            PAYMENT
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
            결제 처리 중입니다.
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
            <br />
            창을 닫거나 새로고침하지
            마세요.
          </p>
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
            PAYMENT ERROR
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
            결제 처리를 완료하지
            못했습니다.
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
            결제 금액이 실제로 승인됐는데
            리포트가 생성되지 않았다면
            molip.help@gmail.com으로
            문의해 주세요.
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