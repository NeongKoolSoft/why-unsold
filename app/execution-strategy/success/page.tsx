"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import ExecutionStrategyReport from
  "../execution-strategy-report";

import type {
  ExecutionStrategy,
  ExecutionStrategyInput,
} from "../../execution-strategy-types";

import type {
  Diagnosis,
} from "../../report-types";

import {
  EXECUTION_STRATEGY_PRODUCT,
} from "../../lib/execution-strategy-config";

import {
  isDiagnosisForStrategy,
  isExecutionStrategyInput,
} from "../../lib/execution-strategy-validation";

type PaymentMethod =
  | "CARD"
  | "TRANSFER";

type StoredStrategyOrder = {
  paymentId: string;

  amount: number;

  diagnosis:
    Diagnosis;

  executionInput:
    ExecutionStrategyInput;

  orderToken: string;

  payMethod:
    PaymentMethod;

  createdAt: string;
};

type ConfirmResponse = {
  ok?: boolean;

  strategyToken?: string;

  payment?: {
    paymentId?: string;

    transactionId?:
      string | null;

    status?: string;

    totalAmount?: number;

    currency?: string;

    method?:
      string | null;

    paidAt?:
      string | null;
  };

  error?: string;

  detail?: string;
};

type StrategyResponse = {
  strategy?:
    ExecutionStrategy;

  error?: string;

  detail?: string;
};

function removeStoredOrder(
  paymentId: string
) {
  const storageKey =
    `whyunsold:strategy-order:${paymentId}`;

  sessionStorage.removeItem(
    storageKey
  );

  localStorage.removeItem(
    storageKey
  );

  sessionStorage.removeItem(
    "whyunsold:last-strategy-payment-id"
  );

  localStorage.removeItem(
    "whyunsold:last-strategy-payment-id"
  );
}

function StrategySuccessContent() {
  const [
    status,
    setStatus,
  ] =
    useState<
      | "loading"
      | "success"
      | "error"
    >(
      "loading"
    );

  const [
    message,
    setMessage,
  ] =
    useState(
      "실행전략 결제 상태를 확인하고 있습니다."
    );

  const [
    strategy,
    setStrategy,
  ] =
    useState<
      ExecutionStrategy | null
    >(
      null
    );

  const [
    paidOrder,
    setPaidOrder,
  ] =
    useState<
      StoredStrategyOrder | null
    >(
      null
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    generationFailed,
    setGenerationFailed,
  ] =
    useState(
      false
    );

  const [
    isRetrying,
    setIsRetrying,
  ] =
    useState(
      false
    );

  const startedRef =
    useRef(
      false
    );

  async function confirmPayment(
    order:
      StoredStrategyOrder
  ) {
    const confirmResponse =
      await fetch(
        "/api/execution-strategy/confirm",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              paymentId:
                order.paymentId,

              orderToken:
                order.orderToken,

              diagnosis:
                order.diagnosis,

              executionInput:
                order.executionInput,
            }),

          cache:
            "no-store",
        }
      );

    const confirmData =
      (await confirmResponse.json()) as
        ConfirmResponse;

    if (
      !confirmResponse.ok ||
      !confirmData.ok ||
      !confirmData.strategyToken
    ) {
      throw new Error(
        confirmData.detail ||
          confirmData.error ||
          "실행전략 결제 상태를 확인하지 못했습니다."
      );
    }

    return {
      strategyToken:
        confirmData.strategyToken,

      paymentMethod:
        confirmData.payment
          ?.method ??
        null,
    };
  }

  async function generateStrategy(
    order:
      StoredStrategyOrder,

    strategyToken:
      string
  ) {
    const strategyResponse =
      await fetch(
        "/api/execution-strategy",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              diagnosis:
                order.diagnosis,

              executionInput:
                order.executionInput,

              paymentId:
                order.paymentId,

              strategyToken,
            }),

          cache:
            "no-store",
        }
      );

    const strategyData =
      (await strategyResponse.json()) as
        StrategyResponse;

    if (
      !strategyResponse.ok ||
      !strategyData.strategy
    ) {
      throw new Error(
        strategyData.detail ||
          strategyData.error ||
          "결제는 완료됐지만 30일 실행전략을 생성하지 못했습니다."
      );
    }

    const generatedStrategy =
      strategyData.strategy;

    const cachedResultKey =
      `whyunsold:strategy-result:${order.paymentId}`;

    const strategyStorageKey =
      `whyunsold:strategy:${generatedStrategy.strategyId}`;

    const serializedStrategy =
      JSON.stringify(
        generatedStrategy
      );

    sessionStorage.setItem(
      cachedResultKey,
      serializedStrategy
    );

    localStorage.setItem(
      cachedResultKey,
      serializedStrategy
    );

    sessionStorage.setItem(
      strategyStorageKey,
      serializedStrategy
    );

    localStorage.setItem(
      strategyStorageKey,
      serializedStrategy
    );

    removeStoredOrder(
      order.paymentId
    );

    setStrategy(
      generatedStrategy
    );

    setGenerationFailed(
      false
    );

    setStatus(
      "success"
    );

    setMessage(
      "결제가 완료되었습니다."
    );
  }

  async function retryGeneration() {
    if (
      !paidOrder ||
      isRetrying
    ) {
      return;
    }

    setIsRetrying(
      true
    );

    setStatus(
      "loading"
    );

    setMessage(
      "결제 내역을 다시 확인하고 30일 실행전략을 생성하고 있습니다."
    );

    try {
      /*
       * 재시도할 때 포트원 결제를 다시 조회해
       * 새로운 생성 토큰을 발급받습니다.
       * 추가 결제는 발생하지 않습니다.
       */
      const confirmed =
        await confirmPayment(
          paidOrder
        );

      setPaymentMethod(
        confirmed.paymentMethod
      );

      await generateStrategy(
        paidOrder,
        confirmed.strategyToken
      );
    } catch (error) {
      setGenerationFailed(
        true
      );

      setStatus(
        "error"
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "실행전략을 다시 생성하지 못했습니다."
      );
    } finally {
      setIsRetrying(
        false
      );
    }
  }

  useEffect(() => {
    if (
      startedRef.current
    ) {
      return;
    }

    startedRef.current =
      true;

    async function completePayment() {
      const searchParams =
        new URLSearchParams(
          window.location.search
        );

      const paymentId =
        searchParams
          .get(
            "paymentId"
          )
          ?.trim();

      const paymentErrorCode =
        searchParams
          .get(
            "code"
          )
          ?.trim();

      const paymentErrorMessage =
        searchParams
          .get(
            "message"
          )
          ?.trim();

      if (!paymentId) {
        setStatus(
          "error"
        );

        setMessage(
          "결제 결과의 결제번호를 확인할 수 없습니다."
        );

        return;
      }

      if (
        paymentErrorCode
      ) {
        removeStoredOrder(
          paymentId
        );

        setStatus(
          "error"
        );

        setMessage(
          paymentErrorMessage ||
            `결제가 완료되지 않았습니다. (${paymentErrorCode})`
        );

        return;
      }

      const cachedResultKey =
        `whyunsold:strategy-result:${paymentId}`;

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
            ) as
              ExecutionStrategy;

          if (
            !parsed ||
            typeof parsed !==
              "object" ||
            typeof parsed.strategyId !==
              "string" ||
            !parsed.strategyId
          ) {
            throw new Error(
              "저장된 실행전략 형식이 올바르지 않습니다."
            );
          }

          setStrategy(
            parsed
          );

          setStatus(
            "success"
          );

          setMessage(
            "생성된 30일 실행전략을 불러왔습니다."
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

      const storageKey =
        `whyunsold:strategy-order:${paymentId}`;

      const storedOrderRaw =
        sessionStorage.getItem(
          storageKey
        ) ??
        localStorage.getItem(
          storageKey
        );

      if (!storedOrderRaw) {
        setStatus(
          "error"
        );

        setMessage(
          "결제 전 실행전략 정보를 찾지 못했습니다. 결제를 시작한 브라우저에서 다시 확인해주세요."
        );

        return;
      }

      let storedOrder:
        StoredStrategyOrder;

      try {
        storedOrder =
          JSON.parse(
            storedOrderRaw
          ) as
            StoredStrategyOrder;
      } catch {
        removeStoredOrder(
          paymentId
        );

        setStatus(
          "error"
        );

        setMessage(
          "저장된 실행전략 주문 정보를 읽지 못했습니다."
        );

        return;
      }

      if (
        storedOrder.paymentId !==
          paymentId ||
        storedOrder.amount !==
          EXECUTION_STRATEGY_PRODUCT
            .price ||
        typeof storedOrder.orderToken !==
          "string" ||
        !storedOrder.orderToken ||
        !isDiagnosisForStrategy(
          storedOrder.diagnosis
        ) ||
        !isExecutionStrategyInput(
          storedOrder.executionInput
        )
      ) {
        setStatus(
          "error"
        );

        setMessage(
          "저장된 실행전략 결제 정보가 결제 결과와 일치하지 않습니다."
        );

        return;
      }

      setPaidOrder(
        storedOrder
      );

      try {
        setMessage(
          "실행전략 결제 상태를 확인하고 있습니다."
        );

        const confirmed =
          await confirmPayment(
            storedOrder
          );

        setPaymentMethod(
          confirmed.paymentMethod
        );

        setMessage(
          "결제가 완료되었습니다. 30일 실행전략을 생성하고 있습니다."
        );

        try {
          await generateStrategy(
            storedOrder,
            confirmed.strategyToken
          );
        } catch (
          generationError
        ) {
          setGenerationFailed(
            true
          );

          setStatus(
            "error"
          );

          setMessage(
            generationError instanceof
              Error
              ? generationError.message
              : "결제는 완료됐지만 30일 실행전략을 생성하지 못했습니다."
          );
        }
      } catch (error) {
        setGenerationFailed(
          false
        );

        setStatus(
          "error"
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "실행전략 결제 처리 중 오류가 발생했습니다."
        );
      }
    }

    void completePayment();
  }, []);

  if (
    status ===
      "loading"
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
            boxSizing:
              "border-box",
            border:
              "1px solid #d9ddd7",
            background:
              "#fff",
            textAlign:
              "center",
          }}
        >
          <p
            style={{
              margin:
                0,
              color:
                "#0b684d",
              fontSize:
                13,
              fontWeight:
                800,
              letterSpacing:
                "0.08em",
            }}
          >
            30 DAY ACTION
          </p>

          <h1
            style={{
              margin:
                "18px 0 0",
              fontSize:
                "clamp(28px, 5vw, 40px)",
              lineHeight:
                1.3,
              letterSpacing:
                "-0.04em",
            }}
          >
            실행전략을 생성하고 있습니다.
          </h1>

          <p
            style={{
              margin:
                "18px 0 0",
              color:
                "#66736c",
              fontSize:
                15,
              lineHeight:
                1.8,
            }}
          >
            {message}
            <br />
            매도 조건과 진단 결과를 분석하고 있으니 잠시만 기다려주세요.
          </p>
        </section>
      </main>
    );
  }

  if (
    status ===
      "error" ||
    !strategy
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
            boxSizing:
              "border-box",
            border:
              "1px solid #d9ddd7",
            background:
              "#fff",
          }}
        >
          <p
            style={{
              margin:
                0,
              color:
                "#a33a2b",
              fontSize:
                13,
              fontWeight:
                800,
              letterSpacing:
                "0.08em",
            }}
          >
            {generationFailed
              ? "STRATEGY ERROR"
              : "PAYMENT ERROR"}
          </p>

          <h1
            style={{
              margin:
                "18px 0 0",
              fontSize:
                "clamp(30px, 5vw, 44px)",
              lineHeight:
                1.25,
              letterSpacing:
                "-0.04em",
            }}
          >
            {generationFailed
              ? "결제는 완료됐지만 실행전략을 생성하지 못했습니다."
              : "결제 처리를 완료하지 못했습니다."}
          </h1>

          <p
            style={{
              margin:
                "18px 0 0",
              color:
                "#66736c",
              fontSize:
                15,
              lineHeight:
                1.8,
            }}
          >
            {message}
          </p>

          {generationFailed &&
          paidOrder ? (
            <button
              type="button"
              onClick={
                retryGeneration
              }
              disabled={
                isRetrying
              }
              style={{
                display:
                  "inline-flex",
                minHeight:
                  52,
                marginTop:
                  28,
                padding:
                  "0 24px",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                border:
                  0,
                background:
                  "#0b684d",
                color:
                  "#fff",
                font:
                  "inherit",
                fontWeight:
                  800,
                cursor:
                  isRetrying
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  isRetrying
                    ? 0.65
                    : 1,
              }}
            >
              {isRetrying
                ? "실행전략 다시 생성 중…"
                : "실행전략 다시 생성하기"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              style={{
                display:
                  "inline-flex",
                minHeight:
                  52,
                marginTop:
                  28,
                padding:
                  "0 24px",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                border:
                  0,
                background:
                  "#0b684d",
                color:
                  "#fff",
                font:
                  "inherit",
                fontWeight:
                  800,
                cursor:
                  "pointer",
              }}
            >
              이전 화면으로 돌아가기
            </button>
          )}

          <p
            style={{
              margin:
                "20px 0 0",
              color:
                "#7a857f",
              fontSize:
                12,
              lineHeight:
                1.7,
            }}
          >
            {generationFailed
              ? "다시 생성해도 결과가 나타나지 않으면 molip.help@gmail.com으로 문의해 주세요. 추가 결제는 필요하지 않습니다."
              : "결제가 완료된 것으로 보이는데 실행전략이 나타나지 않으면 molip.help@gmail.com으로 문의해 주세요."}
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
          "#e9e7df",
      }}
    >
      <div
        style={{
          width:
            "min(1120px, calc(100% - 32px))",
          margin:
            "0 auto",
          padding:
            "24px 0 0",
        }}
      >
        <div
          style={{
            padding:
              "18px 22px",
            border:
              "1px solid #cddbd1",
            background:
              "#eef4ef",
            color:
              "#31453a",
            fontSize:
              13,
            lineHeight:
              1.7,
          }}
        >
          결제가 정상적으로 완료되었습니다.
          {paymentMethod
            ? ` 결제수단: ${paymentMethod}.`
            : ""}
          {" "}
          아래에서 생성된 30일 매도 실행전략을 확인할 수 있습니다.
        </div>
      </div>

      <ExecutionStrategyReport
        strategy={
          strategy
        }
      />
    </main>
  );
}

export default function ExecutionStrategySuccessPage() {
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
            color:
              "#17231d",
          }}
        >
          실행전략 결제 결과를 확인하고 있습니다.
        </main>
      }
    >
      <StrategySuccessContent />
    </Suspense>
  );
}