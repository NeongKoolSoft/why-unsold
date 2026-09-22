"use client";

import {
  useState,
} from "react";

import type {
  PriceCheckOrderData,
} from "../price-check-types";

const PRICE_CHECK_PRICE =
  2900;

const PORTONE_SDK_URL =
  "https://cdn.portone.io/v2/browser-sdk.js";

type PayMethod =
  | "CARD"
  | "TRANSFER";

type PortOnePaymentResponse = {
  transactionType?: "PAYMENT";
  txId?: string;
  paymentId?: string;
  code?: string;
  message?: string;
  pgCode?: string;
  pgMessage?: string;
};

type PortOneRequestPayment = {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: "CURRENCY_KRW";
  payMethod: PayMethod;
  redirectUrl: string;
  forceRedirect: boolean;
  productType: "DIGITAL";
};

type PortOneBrowserSdk = {
  requestPayment: (
    request:
      PortOneRequestPayment
  ) => Promise<PortOnePaymentResponse>;
};

type OrderTokenResponse = {
  ok?: boolean;
  productId?: string;
  amount?: number;
  orderToken?: string;
  error?: string;
  detail?: string;
};

type PriceCheckPaymentProps = {
  orderData:
    PriceCheckOrderData;
};

function getPortOne() {
  const paymentWindow =
    window as typeof window & {
      PortOne?:
        PortOneBrowserSdk;
    };

  return (
    paymentWindow.PortOne ??
    null
  );
}

function loadPortOneSdk() {
  return new Promise<void>(
    (
      resolve,
      reject
    ) => {
      if (
        getPortOne()
      ) {
        resolve();
        return;
      }

      let settled =
        false;

      let readyCheckTimer:
        number;

      let timeoutTimer:
        number;

      const finishSuccess =
        () => {
          if (settled) {
            return;
          }

          settled =
            true;

          window.clearInterval(
            readyCheckTimer
          );

          window.clearTimeout(
            timeoutTimer
          );

          resolve();
        };

      const finishError = (
        script?:
          HTMLScriptElement
      ) => {
        if (settled) {
          return;
        }

        settled =
          true;

        window.clearInterval(
          readyCheckTimer
        );

        window.clearTimeout(
          timeoutTimer
        );

        if (
          script &&
          script.parentNode
        ) {
          script.parentNode.removeChild(
            script
          );
        }

        reject(
          new Error(
            "포트원 결제 모듈을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
          )
        );
      };

      readyCheckTimer =
        window.setInterval(
          () => {
            if (
              getPortOne()
            ) {
              finishSuccess();
            }
          },
          100
        );

      timeoutTimer =
        window.setTimeout(
          () => {
            const script =
              document.querySelector<HTMLScriptElement>(
                `script[src="${PORTONE_SDK_URL}"]`
              );

            finishError(
              script ??
                undefined
            );
          },
          8000
        );

      const existingScript =
        document.querySelector<HTMLScriptElement>(
          `script[src="${PORTONE_SDK_URL}"]`
        );

      if (
        existingScript
      ) {
        existingScript.addEventListener(
          "load",
          () => {
            if (
              getPortOne()
            ) {
              finishSuccess();
            }
          },
          {
            once: true,
          }
        );

        existingScript.addEventListener(
          "error",
          () =>
            finishError(
              existingScript
            ),
          {
            once: true,
          }
        );

        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.src =
        PORTONE_SDK_URL;

      script.async =
        true;

      script.addEventListener(
        "load",
        () => {
          if (
            getPortOne()
          ) {
            finishSuccess();
          }
        },
        {
          once: true,
        }
      );

      script.addEventListener(
        "error",
        () =>
          finishError(
            script
          ),
        {
          once: true,
        }
      );

      document.head.appendChild(
        script
      );
    }
  );
}

function createPaymentId() {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in
      crypto
  ) {
    return `WHYUNSOLD${crypto
      .randomUUID()
      .replaceAll(
        "-",
        ""
      )
      .slice(
        0,
        28
      )}`;
  }

  return (
    "WHYUNSOLD" +
    Date.now().toString(
      36
    ) +
    Math.random()
      .toString(36)
      .slice(
        2,
        10
      )
  ).slice(
    0,
    40
  );
}

function trackPaymentClick(
  payMethod:
    PayMethod
) {
  const analyticsWindow =
    window as typeof window & {
      gtag?: (
        command:
          "event",
        eventName:
          string,
        params?: Record<
          string,
          string | number
        >
      ) => void;
    };

  if (
    typeof analyticsWindow.gtag !==
    "function"
  ) {
    return;
  }

  analyticsWindow.gtag(
    "event",
    "purchase_click",
    {
      value:
        PRICE_CHECK_PRICE,
      currency:
               "KRW",
      payment_method:
        payMethod,
      item_id:
        "PRICE_CHECK",
      item_name:
        "매도 전 가격 진단",
    }
  );
}

export default function PriceCheckPayment({
  orderData,
}: PriceCheckPaymentProps) {
  const [
    payMethod,
    setPayMethod,
  ] =
    useState<PayMethod>(
      "CARD"
    );

  const [
    isOpeningPayment,
    setIsOpeningPayment,
  ] =
    useState(false);

  const [
    paymentError,
    setPaymentError,
  ] =
    useState("");

  async function startPayment() {
    if (
      isOpeningPayment
    ) {
      return;
    }

    setPaymentError("");
    setIsOpeningPayment(
      true
    );

    try {
      const storeId =
        process.env
          .NEXT_PUBLIC_PORTONE_STORE_ID
          ?.trim();

      const channelKey =
        process.env
          .NEXT_PUBLIC_PORTONE_CHANNEL_KEY
          ?.trim();

      if (
        !storeId ||
        !channelKey
      ) {
        throw new Error(
          "결제 환경정보가 설정되지 않았습니다."
        );
      }

      await loadPortOneSdk();

      const portOne =
        getPortOne();

      if (
        !portOne
      ) {
        throw new Error(
          "포트원 결제 모듈을 초기화하지 못했습니다."
        );
      }

      const paymentId =
        createPaymentId();

      const orderTokenResponse =
        await fetch(
          "/api/payment/order-token",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                productId:
                  "price-check",

                paymentId,

                amount:
                  PRICE_CHECK_PRICE,

                diagnosis:
                  orderData,
              }),

            cache:
              "no-store",
          }
        );

      const orderTokenData =
        (await orderTokenResponse.json()) as OrderTokenResponse;

      if (
        !orderTokenResponse.ok ||
        !orderTokenData.ok ||
        !orderTokenData.orderToken
      ) {
        throw new Error(
          orderTokenData.detail ||
            orderTokenData.error ||
            "주문 보안정보를 생성하지 못했습니다."
        );
      }

      if (
        orderTokenData.amount !==
        PRICE_CHECK_PRICE ||
        orderTokenData.productId !==
        "price-check"
      ) {
        throw new Error(
          "서버의 상품 정보가 결제 요청과 일치하지 않습니다."
        );
      }

      const storedOrder =
        JSON.stringify({
          productId:
            "price-check",

          paymentId,

          amount:
            PRICE_CHECK_PRICE,

          diagnosis:
            orderData,

          orderToken:
            orderTokenData.orderToken,

          payMethod,

          createdAt:
            new Date().toISOString(),
        });

      const storageKey =
        `whyunsold:price-check:order:${paymentId}`;

      sessionStorage.setItem(
        storageKey,
        storedOrder
      );

      localStorage.setItem(
        storageKey,
        storedOrder
      );

      sessionStorage.setItem(
        "whyunsold:price-check:last-payment-id",
        paymentId
      );

      localStorage.setItem(
        "whyunsold:price-check:last-payment-id",
        paymentId
      );

      trackPaymentClick(
        payMethod
      );

      const baseUrl =
        window.location.origin;

      const response =
        await portOne.requestPayment(
          {
            storeId,
            channelKey,
            paymentId,

            orderName:
              "매도 전 가격 진단",

            totalAmount:
              PRICE_CHECK_PRICE,

            currency:
              "CURRENCY_KRW",

            payMethod,

            redirectUrl:
              `${baseUrl}/price-check/payment/success`,

            forceRedirect:
              true,

            productType:
              "DIGITAL",
          }
        );

      if (
        response?.code
      ) {
        sessionStorage.removeItem(
          storageKey
        );

        localStorage.removeItem(
          storageKey
        );

        throw new Error(
          response.message ||
            response.pgMessage ||
            `결제가 완료되지 않았습니다. (${response.code})`
        );
      }

      /*
       * 일부 브라우저에서 결제창이 리다이렉트 대신
       * 응답을 반환하는 경우 완료 페이지로 직접 이동합니다.
       */
      window.location.href =
        `/price-check/payment/success?paymentId=${encodeURIComponent(
          paymentId
        )}`;
    } catch (
      error
    ) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "결제창을 열지 못했습니다."
      );

      setIsOpeningPayment(
        false
      );
    }
  }

  return (
    <section className="price-check-payment">
      <div className="payment-heading">
        <p>
          진단 가능
        </p>

        <h2>
          동일 면적 실거래
          자료를 확인했습니다.
        </h2>
      </div>

      <dl className="order-summary">
        <div>
          <dt>
            아파트 단지
          </dt>

          <dd>
            {
              orderData
                .property
                .apartmentName
            }
          </dd>
        </div>

        <div>
          <dt>
            전용면적
          </dt>

          <dd>
            {orderData
              .property
              .exclusiveArea.toLocaleString(
                "ko-KR"
              )}
            ㎡
          </dd>
        </div>

        <div>
          <dt>
            희망가격
          </dt>

          <dd>
            {orderData
              .property
              .askingPrice.toLocaleString(
                "ko-KR"
              )}
            만원
          </dd>
        </div>
      </dl>

      <fieldset className="payment-methods">
        <legend>
          결제수단
        </legend>

        <label
          className={
            payMethod ===
            "CARD"
              ? "selected"
              : ""
          }
        >
          <input
            type="radio"
            name="price-check-pay-method"
            value="CARD"
            checked={
              payMethod ===
              "CARD"
            }
            onChange={() =>
              setPayMethod(
                "CARD"
              )
            }
            disabled={
              isOpeningPayment
            }
          />

          <span>
            신용·체크카드
          </span>
        </label>

        <label
          className={
            payMethod ===
            "TRANSFER"
              ? "selected"
              : ""
          }
        >
          <input
            type="radio"
            name="price-check-pay-method"
            value="TRANSFER"
            checked={
              payMethod ===
              "TRANSFER"
            }
            onChange={() =>
              setPayMethod(
                "TRANSFER"
              )
            }
            disabled={
              isOpeningPayment
            }
          />

          <span>
            계좌이체
          </span>
        </label>
      </fieldset>

      {paymentError ? (
        <p className="payment-error">
          {paymentError}
        </p>
      ) : null}

      <button
        className="payment-button"
        type="button"
        onClick={
          startPayment
        }
        disabled={
          isOpeningPayment
        }
      >
        <span>
          {isOpeningPayment
            ? "결제창 여는 중…"
            : "가격 진단 결제하기"}
        </span>

        <strong>
          {PRICE_CHECK_PRICE.toLocaleString("ko-KR")}원
        </strong>
      </button>

      <p className="payment-note">
        결제 완료 후 가격 진단
        결과가 바로 생성됩니다.
      </p>

      <style jsx>{`
        .price-check-payment {
          width: min(
            900px,
            100%
          );
          margin: 34px 0 0
            auto;
          padding: 36px 40px;
          border: 1px solid
            var(--ink);
          background:
            var(--white);
          box-shadow:
            14px 14px 0
            var(--mint);
          color:
            var(--ink);
        }

        .payment-heading {
          padding-bottom:
            24px;
          border-bottom:
            1px solid
            var(--line);
        }

        .payment-heading p {
          margin: 0;
          color:
            var(--green);
          font-size: 11px;
          font-weight: 900;
          letter-spacing:
            0.07em;
        }

        .payment-heading h2 {
          margin:
            13px 0 0;
          font-size: 27px;
          line-height: 1.35;
          letter-spacing:
            -0.045em;
        }

        .order-summary {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          margin: 0;
          padding:
            25px 0;
          border-bottom:
            1px solid
            var(--line);
        }

        .order-summary > div {
          min-width: 0;
          padding:
            0 20px;
          border-right:
            1px solid
            var(--line);
        }

        .order-summary > div:first-child {
          padding-left:
            0;
        }

        .order-summary > div:last-child {
          padding-right:
            0;
          border-right:
            0;
        }

        .order-summary dt {
          margin-bottom:
            7px;
          color:
            #747d78;
          font-size: 10px;
          font-weight: 800;
        }

        .order-summary dd {
          margin: 0;
          overflow: hidden;
          color:
            var(--ink);
          font-size: 13px;
          font-weight: 800;
          line-height: 1.5;
          text-overflow:
            ellipsis;
        }

        .payment-methods {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 10px;
          margin:
            26px 0 0;
          padding: 0;
          border: 0;
        }

        .payment-methods legend {
          margin-bottom:
            11px;
          font-size: 12px;
          font-weight: 800;
        }

        .payment-methods label {
          min-height: 58px;
          display: flex;
          align-items:
            center;
          gap: 10px;
          padding:
            0 16px;
          border: 1px solid
            var(--line);
          background:
            #fbfcfb;
          cursor: pointer;
        }

        .payment-methods label.selected {
          border-color:
            var(--green);
          background:
            var(--mint-soft);
        }

        .payment-methods input {
          accent-color:
            var(--green);
        }

        .payment-methods span {
          font-size: 13px;
          font-weight: 800;
        }

        .payment-error {
          margin:
            18px 0 0;
          padding:
            14px 16px;
          border-left:
            4px solid
            #a33a2b;
          background:
            #fff2ef;
          color:
            #8b3024;
          font-size: 12px;
          line-height: 1.65;
        }

        .payment-button {
          width: 100%;
          min-height: 60px;
          margin-top:
            24px;
          display: flex;
          align-items:
            center;
          justify-content:
            space-between;
          padding:
            0 23px;
          border: 0;
          background:
            var(--green);
          color: #fff;
          font: inherit;
          cursor: pointer;
        }

        .payment-button:hover:not(
            :disabled
          ) {
          background:
            var(
              --green-deep
            );
        }

        .payment-button:disabled {
          opacity: 0.65;
          cursor:
            not-allowed;
        }

        .payment-button span,
        .payment-button strong {
          font-size: 15px;
          font-weight: 800;
        }

        .payment-note {
          margin:
            12px 0 0;
          color:
            #7b847f;
          font-size: 10px;
          text-align:
            center;
        }

        @media (
          max-width: 680px
        ) {
          .price-check-payment {
            padding:
              28px 21px;
            box-shadow:
              8px 8px 0
              var(--mint);
          }

          .order-summary {
            grid-template-columns:
              1fr;
            gap: 14px;
          }

          .order-summary > div,
          .order-summary > div:first-child,
          .order-summary > div:last-child {
            padding: 0;
            border-right: 0;
          }

          .payment-methods {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </section>
  );
}