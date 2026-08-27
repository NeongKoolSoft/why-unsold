"use client";

import {
  useState,
} from "react";

import type {
  Diagnosis,
} from "../report-types";

import type {
  ExecutionStrategyInput,
} from "../execution-strategy-types";

import {
  EXECUTION_STRATEGY_PRODUCT,
} from "../lib/execution-strategy-config";

import {
  loadPortOneSdk,
} from "../lib/portone-browser";

import PreviewStrategyGenerator from "./preview-strategy-generator";

type PaymentMethod =
  | "CARD"
  | "TRANSFER";

type ExecutionStrategyPaymentProps = {
  diagnosis:
    Diagnosis;

  executionInput:
    ExecutionStrategyInput;
};

type OrderTokenResponse = {
  ok?: boolean;

  orderToken?: string;

  error?: string;

  detail?: string;
};

type PortOnePaymentResponse = {
  paymentId?: string;

  code?: string;

  message?: string;

  pgCode?: string;

  pgMessage?: string;
};

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

function createPaymentId() {
  const randomPart =
    window.crypto
      .randomUUID()
      .replaceAll(
        "-",
        ""
      )
      .slice(
        0,
        20
      );

  return (
    EXECUTION_STRATEGY_PRODUCT
      .paymentPrefix +
    randomPart
  );
}

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

export default function ExecutionStrategyPayment({
  diagnosis,
  executionInput,
}: ExecutionStrategyPaymentProps) {
  const [
    payMethod,
    setPayMethod,
  ] =
    useState<PaymentMethod>(
      "CARD"
    );

  const [
    isPaying,
    setIsPaying,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function requestPayment() {
    if (isPaying) {
      return;
    }

    const storeId =
      process.env
        .NEXT_PUBLIC_PORTONE_STORE_ID?.trim();

    const channelKey =
      process.env
        .NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();

    if (
      !storeId ||
      !channelKey
    ) {
      setError(
        "결제 환경설정을 확인할 수 없습니다."
      );
      return;
    }

    setIsPaying(true);
    setError("");

    const paymentId =
      createPaymentId();

    const storageKey =
      `whyunsold:strategy-order:${paymentId}`;

    try {
      await loadPortOneSdk();

      const portOne =
          window.PortOne;

      if (!portOne) {
          throw new Error(
          "결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
          );
      }

      const tokenResponse =
        await fetch(
          "/api/execution-strategy/order-token",
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

                amount:
                  EXECUTION_STRATEGY_PRODUCT
                    .price,

                diagnosis,

                executionInput,
              }),

            cache:
              "no-store",
          }
        );

      const tokenData =
        (await tokenResponse.json()) as
          OrderTokenResponse;

      if (
        !tokenResponse.ok ||
        !tokenData.ok ||
        !tokenData.orderToken
      ) {
        throw new Error(
          tokenData.detail ||
            tokenData.error ||
            "실행전략 주문 정보를 생성하지 못했습니다."
        );
      }

      const storedOrder:
        StoredStrategyOrder = {
          paymentId,

          amount:
            EXECUTION_STRATEGY_PRODUCT
              .price,

          diagnosis,

          executionInput,

          orderToken:
            tokenData.orderToken,

          payMethod,

          createdAt:
            new Date()
              .toISOString(),
        };

      const serializedOrder =
        JSON.stringify(
          storedOrder
        );

      sessionStorage.setItem(
        storageKey,
        serializedOrder
      );

      localStorage.setItem(
        storageKey,
        serializedOrder
      );

      sessionStorage.setItem(
        "whyunsold:last-strategy-payment-id",
        paymentId
      );

      localStorage.setItem(
        "whyunsold:last-strategy-payment-id",
        paymentId
      );

      const redirectUrl =
        `${window.location.origin}` +
        `/execution-strategy/success?paymentId=${encodeURIComponent(
          paymentId
        )}`;

      const response =
        (await portOne.requestPayment({
          storeId,

          channelKey,

          paymentId,

          orderName:
            EXECUTION_STRATEGY_PRODUCT
              .orderName,

          totalAmount:
            EXECUTION_STRATEGY_PRODUCT
              .price,

          currency:
            "CURRENCY_KRW",

          payMethod,

          redirectUrl,

          forceRedirect:
            true,

          productType:
            "DIGITAL",
        })) as
          | PortOnePaymentResponse
          | undefined;

      if (
        response?.code
      ) {
        removeStoredOrder(
          paymentId
        );

        throw new Error(
          response.message ||
            response.pgMessage ||
            "결제 요청에 실패했습니다."
        );
      }

      if (
        response?.paymentId &&
        response.paymentId !==
          paymentId
      ) {
        removeStoredOrder(
          paymentId
        );

        throw new Error(
          "결제 결과의 결제번호가 요청 정보와 일치하지 않습니다."
        );
      }

      /*
       * forceRedirect가 동작하지 않는 결제환경에 대비합니다.
       */
      if (
        response?.paymentId ===
          paymentId
      ) {
        window.location.href =
          redirectUrl;
      }
    } catch (paymentError) {
      removeStoredOrder(
        paymentId
      );

      setError(
        paymentError instanceof
          Error
          ? paymentError.message
          : "결제 요청 중 오류가 발생했습니다."
      );

      setIsPaying(false);
    }
  }

  return (
    <div>
      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap:
            10,
          marginTop:
            24,
        }}
      >
        <button
          type="button"
          onClick={() =>
            setPayMethod(
              "CARD"
            )
          }
          disabled={
            isPaying
          }
          style={{
            minHeight:
              50,
            border:
              payMethod ===
              "CARD"
                ? "2px solid #0b684d"
                : "1px solid #c9d1cc",
            background:
              payMethod ===
              "CARD"
                ? "#fff"
                : "#f7f7f3",
            color:
              "#17231d",
            font:
              "inherit",
            fontWeight:
              800,
            cursor:
              isPaying
                ? "not-allowed"
                : "pointer",
          }}
        >
          카드
        </button>

        <button
          type="button"
          onClick={() =>
            setPayMethod(
              "TRANSFER"
            )
          }
          disabled={
            isPaying
          }
          style={{
            minHeight:
              50,
            border:
              payMethod ===
              "TRANSFER"
                ? "2px solid #0b684d"
                : "1px solid #c9d1cc",
            background:
              payMethod ===
              "TRANSFER"
                ? "#fff"
                : "#f7f7f3",
            color:
              "#17231d",
            font:
              "inherit",
            fontWeight:
              800,
            cursor:
              isPaying
                ? "not-allowed"
                : "pointer",
          }}
        >
          계좌이체
        </button>
      </div>

      <button
        type="button"
        onClick={
          requestPayment
        }
        disabled={
          isPaying
        }
        style={{
          width:
            "100%",
          minHeight:
            58,
          marginTop:
            12,
          border:
            0,
          background:
            "#0b684d",
          color:
            "#fff",
          font:
            "inherit",
          fontSize:
            15,
          fontWeight:
            800,
          cursor:
            isPaying
              ? "not-allowed"
              : "pointer",
          opacity:
            isPaying
              ? 0.65
              : 1,
        }}
      >
        {isPaying
          ? "결제창을 불러오고 있습니다…"
          : `${EXECUTION_STRATEGY_PRODUCT.price.toLocaleString(
              "ko-KR"
            )}원 결제하기 →`}
      </button>

      {error && (
        <p
          role="alert"
          style={{
            margin:
              "14px 0 0",
            padding:
              "14px 16px",
            border:
              "1px solid #d9b6ad",
            background:
              "#fff5f2",
            color:
              "#9a382b",
            fontSize:
              13,
            lineHeight:
              1.7,
          }}
        >
          {error}
        </p>
      )}

      <PreviewStrategyGenerator
        diagnosis={
          diagnosis
        }
        executionInput={
          executionInput
        }
      />
      
      <p
        style={{
          margin:
            "14px 0 0",
          color:
            "#6d7972",
          fontSize:
            12,
          lineHeight:
            1.7,
        }}
      >
        결제 완료 후 30일 실행전략이 자동으로 생성됩니다.
        생성에 실패해도 추가 결제 없이 다시 시도할 수 있습니다.
      </p>
    </div>
  );
}