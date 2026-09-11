"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import PriceCheckReportView from "../../price-check-report";

import type {
  PriceCheckOrderData,
  PriceCheckReport,
} from "../../../price-check-types";

const PRICE_CHECK_PRICE =
  4900;

type StoredPriceCheckOrder = {
  productId:
    "price-check";
  paymentId: string;
  amount: number;
  diagnosis:
    PriceCheckOrderData;
  orderToken: string;
  payMethod?:
    | "CARD"
    | "TRANSFER";
  createdAt: string;
};

type ConfirmResponse = {
  ok?: boolean;
  analysisToken?: string;

  payment?: {
    paymentId?: string;
    transactionId?:
      | string
      | null;
    status?: string;
    totalAmount?: number;
    currency?: string;
    method?:
      | string
      | null;
    paidAt?:
      | string
      | null;
  };

  error?: string;
  detail?: string;
};

type PriceCheckResponse = {
  ok?: boolean;
  report?:
    PriceCheckReport;
  error?: string;
  detail?: string;
};

type GtagFunction = (
  command: "event",
  eventName: string,
  params?: Record<
    string,
    unknown
  >
) => void;

function getGtag():
  | GtagFunction
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const analyticsWindow =
    window as typeof window & {
      gtag?: GtagFunction;
    };

  return typeof analyticsWindow.gtag ===
    "function"
    ? analyticsWindow.gtag
    : null;
}

function trackPurchaseComplete(
  paymentId: string,
  paymentMethod?:
    | string
    | null
) {
  const gtag =
    getGtag();

  if (!gtag) {
    return;
  }

  const trackingKey =
    `whyunsold:price-check:ga-purchase:${paymentId}`;

  const alreadyTracked =
    sessionStorage.getItem(
      trackingKey
    ) === "1" ||
    localStorage.getItem(
      trackingKey
    ) === "1";

  if (
    alreadyTracked
  ) {
    return;
  }

  gtag(
    "event",
    "purchase_complete",
    {
      payment_id:
        paymentId,
      value:
        PRICE_CHECK_PRICE,
      currency:
        "KRW",
      payment_method:
        paymentMethod ??
        "unknown",
      item_id:
        "PRICE_CHECK",
      item_name:
        "매도 전 가격 진단",
    }
  );

  gtag(
    "event",
    "purchase",
    {
      transaction_id:
        paymentId,
      value:
        PRICE_CHECK_PRICE,
      currency:
        "KRW",

      items: [
        {
          item_id:
            "PRICE_CHECK",
          item_name:
            "매도 전 가격 진단",
          price:
            PRICE_CHECK_PRICE,
          quantity: 1,
        },
      ],
    }
  );

  sessionStorage.setItem(
    trackingKey,
    "1"
  );

  localStorage.setItem(
    trackingKey,
    "1"
  );
}

function PriceCheckSuccessContent() {
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
    report,
    setReport,
  ] =
    useState<PriceCheckReport | null>(
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
    paidOrderData,
    setPaidOrderData,
  ] =
    useState<PriceCheckOrderData | null>(
      null
    );

  const [
    paidAnalysisToken,
    setPaidAnalysisToken,
  ] =
    useState("");

  const [
    analysisFailedAfterPayment,
    setAnalysisFailedAfterPayment,
  ] =
    useState(false);

  const [
    isRetrying,
    setIsRetrying,
  ] =
    useState(false);

  const startedRef =
    useRef(false);

  async function runPriceCheck(
    diagnosis:
      PriceCheckOrderData,
    paymentId: string,
    analysisToken: string
  ) {
    const response =
      await fetch(
        "/api/price-check",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              paymentId,
              analysisToken,
              diagnosis,
            }),

          cache:
            "no-store",
        }
      );

    const data =
      (await response.json()) as PriceCheckResponse;

    if (
      !response.ok ||
      !data.ok ||
      !data.report
    ) {
      throw new Error(
        data.detail ||
          data.error ||
          "결제는 완료됐지만 가격 진단 결과를 생성하지 못했습니다."
      );
    }

    const resultKey =
      `whyunsold:price-check:result:${paymentId}`;

    const serialized =
      JSON.stringify(
        data.report
      );

    sessionStorage.setItem(
      resultKey,
      serialized
    );

    localStorage.setItem(
      resultKey,
      serialized
    );

    const orderKey =
      `whyunsold:price-check:order:${paymentId}`;

    sessionStorage.removeItem(
      orderKey
    );

    localStorage.removeItem(
      orderKey
    );

    sessionStorage.removeItem(
      "whyunsold:price-check:last-payment-id"
    );

    localStorage.removeItem(
      "whyunsold:price-check:last-payment-id"
    );

    setReport(
      data.report
    );

    setStatus(
      "success"
    );

    setMessage(
      "결제와 가격 진단이 완료되었습니다."
    );

    setAnalysisFailedAfterPayment(
      false
    );
  }

  async function retryPriceCheck() {
    if (
      !paidOrderData ||
      !paidAnalysisToken ||
      isRetrying
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const paymentId =
      params.get(
        "paymentId"
      );

    if (
      !paymentId
    ) {
      setMessage(
        "결제번호를 확인할 수 없습니다."
      );
      return;
    }

    setIsRetrying(true);
    setStatus("loading");

    setMessage(
      "결제는 완료되었습니다. 가격 진단 결과를 다시 생성하고 있습니다."
    );

    try {
      await runPriceCheck(
        paidOrderData,
        paymentId,
        paidAnalysisToken
      );
    } catch (
      error
    ) {
      setStatus(
        "error"
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "가격 진단 결과 생성 중 오류가 발생했습니다."
      );

      setAnalysisFailedAfterPayment(
        true
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
      const params =
        new URLSearchParams(
          window.location.search
        );

      const paymentId =
        params.get(
          "paymentId"
        );

      const paymentErrorCode =
        params.get(
          "code"
        );

      const paymentErrorMessage =
        params.get(
          "message"
        );

      if (
        !paymentId
      ) {
        setStatus(
          "error"
        );

        setMessage(
          "결제 결과의 결제번호를 확인할 수 없습니다."
        );

        return;
      }

      const orderKey =
        `whyunsold:price-check:order:${paymentId}`;

      if (
        paymentErrorCode
      ) {
        sessionStorage.removeItem(
          orderKey
        );

        localStorage.removeItem(
          orderKey
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

      const resultKey =
        `whyunsold:price-check:result:${paymentId}`;

      const cachedResult =
        sessionStorage.getItem(
          resultKey
        ) ??
        localStorage.getItem(
          resultKey
        );

      if (
        cachedResult
      ) {
        try {
          const parsed =
            JSON.parse(
              cachedResult
            ) as PriceCheckReport;

          trackPurchaseComplete(
            paymentId,
            null
          );

          setReport(
            parsed
          );

          setStatus(
            "success"
          );

          setMessage(
            "결제와 가격 진단이 완료되었습니다."
          );

          return;
        } catch {
          sessionStorage.removeItem(
            resultKey
          );

          localStorage.removeItem(
            resultKey
          );
        }
      }

      const storedOrderRaw =
        sessionStorage.getItem(
          orderKey
        ) ??
        localStorage.getItem(
          orderKey
        );

      if (
        !storedOrderRaw
      ) {
        setStatus(
          "error"
        );

        setMessage(
          "결제 전 가격 진단 정보를 찾지 못했습니다. 결제를 시작한 브라우저에서 다시 확인해주세요."
        );

        return;
      }

      let storedOrder:
        StoredPriceCheckOrder;

      try {
        storedOrder =
          JSON.parse(
            storedOrderRaw
          ) as StoredPriceCheckOrder;
      } catch {
        sessionStorage.removeItem(
          orderKey
        );

        localStorage.removeItem(
          orderKey
        );

        setStatus(
          "error"
        );

        setMessage(
          "저장된 주문 정보를 읽지 못했습니다."
        );

        return;
      }

      if (
        storedOrder.productId !==
          "price-check" ||
        storedOrder.paymentId !==
          paymentId ||
        storedOrder.amount !==
          PRICE_CHECK_PRICE ||
        !storedOrder.diagnosis ||
        storedOrder.diagnosis
          .productId !==
          "price-check" ||
        typeof storedOrder.orderToken !==
          "string" ||
        !storedOrder.orderToken
      ) {
        setStatus(
          "error"
        );

        setMessage(
          "저장된 가격 진단 주문정보가 결제 결과와 일치하지 않습니다."
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
              method:
                "POST",

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

        if (
          confirmData.payment
            ?.totalAmount !==
          PRICE_CHECK_PRICE
        ) {
          throw new Error(
            "확인된 결제금액이 가격 진단 상품과 일치하지 않습니다."
          );
        }

        const confirmedPaymentMethod =
          confirmData.payment
            ?.method ??
          storedOrder.payMethod ??
          null;

        setPaymentMethod(
          confirmedPaymentMethod
        );

        trackPurchaseComplete(
          paymentId,
          confirmedPaymentMethod
        );

        setPaidOrderData(
          storedOrder.diagnosis
        );

        setPaidAnalysisToken(
          confirmData.analysisToken
        );

        setMessage(
          "결제가 완료되었습니다. 가격 진단 결과를 생성하고 있습니다."
        );

        try {
          await runPriceCheck(
            storedOrder.diagnosis,
            paymentId,
            confirmData.analysisToken
          );
        } catch (
          analysisError
        ) {
          setStatus(
            "error"
          );

          setMessage(
            analysisError instanceof Error
              ? analysisError.message
              : "결제는 완료됐지만 가격 진단 결과를 생성하지 못했습니다."
          );

          setAnalysisFailedAfterPayment(
            true
          );
        }
      } catch (
        error
      ) {
        setStatus(
          "error"
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다."
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
      <main className="status-page">
        <section className="status-card">
          <p className="status-kicker">
            PRICE CHECK
          </p>

          <h1>
            가격 진단 결과를
            <br />
            생성하고 있습니다.
          </h1>

          <p className="status-message">
            {message}
          </p>
        </section>

        <StatusStyles />
      </main>
    );
  }

  if (
    status ===
      "error" ||
    !report
  ) {
    return (
      <main className="status-page">
        <section className="status-card error-card">
          <p className="status-kicker error">
            {analysisFailedAfterPayment
              ? "REPORT ERROR"
              : "PAYMENT ERROR"}
          </p>

          <h1>
            {analysisFailedAfterPayment
              ? "결제는 완료됐지만 결과를 생성하지 못했습니다."
              : "결제 처리를 완료하지 못했습니다."}
          </h1>

          <p className="status-message">
            {message}
          </p>

          {analysisFailedAfterPayment ? (
            <button
              className="status-button"
              type="button"
              onClick={
                retryPriceCheck
              }
              disabled={
                isRetrying
              }
            >
              {isRetrying
                ? "다시 생성 중…"
                : "가격 진단 다시 생성하기"}
            </button>
          ) : (
            <a
              className="status-button"
              href="/price-check"
            >
              가격 입력으로 돌아가기
            </a>
          )}

          <p className="support-note">
            결제가 완료된 것으로
            보이는데 결과가 나오지
            않으면
            molip.help@gmail.com으로
            문의해 주세요. 추가 결제는
            필요하지 않습니다.
          </p>
        </section>

        <StatusStyles />
      </main>
    );
  }

  return (
    <main className="success-page">
      <div className="success-notice">
        결제가 정상적으로
        완료되었습니다.

        {paymentMethod
          ? ` 결제수단: ${paymentMethod}.`
          : ""}

        {" "}

        아래에서 매도 전 가격
        진단 결과를 확인할 수
        있습니다.
      </div>

      <PriceCheckReportView
        report={report}
        onBack={() => {
          window.location.href =
            "/";
        }}
      />

        <style jsx>{`
        .success-page {
            min-height:
            100vh;
            padding:
            28px 0 60px;
            background:
            var(--paper);
        }

        .success-notice {
            width: min(
            980px,
            calc(100% - 40px)
            );
            margin:
            0 auto 24px;
            padding:
            17px 20px;
            border: 1px solid
            #cddbd1;
            background:
            #eef4ef;
            color: #31453a;
            font-size: 12px;
            line-height: 1.7;
        }

        @media (
            max-width: 680px
        ) {
            .success-notice {
            width: min(
                100% - 32px,
                980px
            );
            }
        }

        @media print {
            .success-page {
            min-height: 0;
            padding: 0;
            background: #fff;
            }

            .success-notice {
            display: none;
            }
        }
        `}</style>
    </main>
  );
}

function StatusStyles() {
  return (
    <style jsx global>{`
      .status-page {
        min-height:
          100vh;
        display: grid;
        place-items:
          center;
        padding:
          40px 20px;
        background:
          var(--paper);
        color:
          var(--ink);
      }

      .status-card {
        width: min(
          680px,
          100%
        );
        padding: 48px;
        border: 1px solid
          var(--line);
        background: #fff;
        text-align:
          center;
      }

      .status-kicker {
        margin: 0;
        color:
          var(--green);
        font-size: 12px;
        font-weight: 900;
        letter-spacing:
          0.09em;
      }

      .status-kicker.error {
        color: #a33a2b;
      }

      .status-card h1 {
        margin:
          18px 0 0;
        font-size: clamp(
          30px,
          5vw,
          44px
        );
        line-height: 1.22;
        letter-spacing:
          -0.05em;
        word-break:
          keep-all;
      }

      .status-message {
        margin:
          18px 0 0;
        color: #66736c;
        font-size: 14px;
        line-height: 1.8;
      }

      .status-button {
        min-height: 52px;
        display:
          inline-flex;
        align-items:
          center;
        justify-content:
          center;
        margin-top: 28px;
        padding:
          0 24px;
        border: 0;
        background:
          var(--green);
        color: #fff;
        font: inherit;
        font-size: 13px;
        font-weight: 800;
        text-decoration:
          none;
        cursor: pointer;
      }

      .status-button:disabled {
        opacity: 0.6;
        cursor:
          not-allowed;
      }

      .support-note {
        margin:
          20px 0 0;
        color: #7a857f;
        font-size: 11px;
        line-height: 1.7;
      }

      @media (
        max-width: 680px
      ) {
        .status-card {
          padding:
            36px 22px;
        }

        .status-card h1 {
          font-size: 31px;
        }
      }
    `}</style>
  );
}

export default function PriceCheckSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="status-page">
          결제 결과를 확인하고
          있습니다.
        </main>
      }
    >
      <PriceCheckSuccessContent />
    </Suspense>
  );
}