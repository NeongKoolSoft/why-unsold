"use client";

import {
  Suspense,
} from "react";
import {
  useSearchParams,
} from "next/navigation";

function PaymentFailContent() {
  const searchParams =
    useSearchParams();

  const code =
    searchParams.get(
      "code"
    ) ??
    "PAYMENT_FAILED";

  const message =
    searchParams.get(
      "message"
    ) ??
    "결제가 완료되지 않았습니다.";

  const orderId =
    searchParams.get(
      "orderId"
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        background: "#f4f2ea",
        color: "#17231d",
      }}
    >
      <section
        style={{
          width:
            "min(680px, 100%)",
          padding: "48px",
          background: "#fff",
          border:
            "1px solid #d9ddd7",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#a33a2b",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing:
              "0.08em",
          }}
        >
          PAYMENT FAILED
        </p>

        <h1
          style={{
            margin:
              "18px 0 0",
            fontSize:
              "clamp(30px, 5vw, 44px)",
            lineHeight: 1.2,
            letterSpacing:
              "-0.04em",
          }}
        >
          결제가 완료되지
          않았습니다.
        </h1>

        <p
          style={{
            margin:
              "18px 0 0",
            color: "#66736c",
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          {message}
        </p>

        <div
          style={{
            marginTop: 28,
            padding:
              "20px 22px",
            background:
              "#f8f8f3",
            border:
              "1px solid #d9ddd7",
            color:
              "#5f6c65",
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong>
              오류 코드
            </strong>
            <br />
            {code}
          </div>

          {orderId && (
            <div
              style={{
                marginTop: 12,
              }}
            >
              <strong>
                주문번호
              </strong>
              <br />
              {orderId}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 28,
          }}
        >
          <a
            href="/#application"
            style={{
              display:
                "inline-flex",
              minHeight: 52,
              padding:
                "0 24px",
              alignItems:
                "center",
              justifyContent:
                "center",
              background:
                "#0b684d",
              color: "#fff",
              textDecoration:
                "none",
              fontWeight: 800,
            }}
          >
            다시 결제하기
          </a>

          <a
            href="/"
            style={{
              display:
                "inline-flex",
              minHeight: 52,
              padding:
                "0 24px",
              alignItems:
                "center",
              justifyContent:
                "center",
              border:
                "1px solid #cfd5d1",
              background: "#fff",
              color: "#17231d",
              textDecoration:
                "none",
              fontWeight: 800,
            }}
          >
            홈으로
          </a>
        </div>

        <p
          style={{
            margin:
              "22px 0 0",
            color: "#7a857f",
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          테스트 환경에서는 실제 결제가
          발생하지 않습니다. 결제 과정에서
          반복적으로 오류가 발생하면
          molip.help@gmail.com으로 문의해
          주세요.
        </p>
      </section>
    </main>
  );
}

export default function PaymentFailPage() {
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
      <PaymentFailContent />
    </Suspense>
  );
}