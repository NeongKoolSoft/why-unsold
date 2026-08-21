import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f2ea",
        color: "#17231d",
      }}
    >
      <div
        style={{
          width: "min(860px, calc(100% - 40px))",
          margin: "0 auto",
          padding: "32px 0 80px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            paddingBottom: 28,
            borderBottom: "1px solid #cfd3cc",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: "#17231d",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#0b684d",
                color: "#fff",
                fontSize: 16,
              }}
            >
              ?
            </span>

            <span>왜 안 팔릴까</span>
          </Link>

          <Link
            href="/"
            style={{
              color: "#516158",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            홈으로
          </Link>
        </header>

        <article
          style={{
            marginTop: 42,
            padding: "48px clamp(24px, 5vw, 58px)",
            background: "#fff",
            border: "1px solid #d9ddd7",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#0b684d",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            REFUND POLICY
          </p>

          <h1
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
            }}
          >
            환불정책
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              color: "#66736c",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            시행일: 2026년 8월 20일
          </p>

          <div
            style={{
              marginTop: 42,
              display: "grid",
              gap: 36,
            }}
          >
            <section>
              <h2 style={sectionTitleStyle}>1. 결제 취소</h2>
              <p style={bodyStyle}>
                분석 리포트 생성이 시작되기 전에는 결제를 취소하고 전액 환불받을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>2. 리포트 생성이 시작된 경우</h2>
              <p style={bodyStyle}>
                본 서비스는 사용자가 입력한 정보와 국토교통부 공개 실거래 자료를 바탕으로 개별 매도 분석 리포트를 생성합니다.
              </p>
              <p style={bodyStyle}>
                결제 후 리포트 생성이 시작되어 서비스 제공이 개시된 경우에는 관련 법령에 따라 단순 변심에 의한 청약철회 및 환불이 제한될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>3. 정상적인 리포트가 제공되지 않은 경우</h2>
              <p style={bodyStyle}>
                아래 사유가 확인되는 경우 전액 환불하거나 정상적인 리포트를 다시 제공할 수 있습니다.
              </p>
              <ul style={listStyle}>
                <li>결제는 완료되었으나 시스템 오류로 리포트가 생성되지 않은 경우</li>
                <li>서비스 오류로 리포트의 주요 내용이 누락되어 정상적인 이용이 어려운 경우</li>
                <li>결제 오류로 동일한 주문이 중복 결제된 경우</li>
              </ul>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>4. 사용자 입력 정보</h2>
              <p style={bodyStyle}>
                아파트 단지명, 희망 매도가, 경쟁 매물 가격, 매물 등록 기간, 문의·방문·협상 횟수 등 사용자가 입력한 정보가 잘못되었음에도 해당 정보를 기준으로 정상적으로 리포트가 생성된 경우에는 서비스 오류로 보지 않습니다.
              </p>
              <p style={bodyStyle}>결제 전 입력 내용을 반드시 확인해 주세요.</p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>5. 분석 결과와 실제 거래 결과</h2>
              <p style={bodyStyle}>
                분석 결과가 사용자의 예상과 다르거나 실제 매도 결과가 리포트의 분석 내용과 다르다는 사유만으로는 서비스 오류에 해당하지 않습니다.
              </p>
              <p style={bodyStyle}>
                본 서비스는 공개 실거래 자료와 사용자가 입력한 정보를 바탕으로 매도 상황을 분석하는 참고용 리포트이며, 거래 성사 또는 특정 가격의 매매를 보장하지 않습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>6. 표시·광고 또는 계약 내용과 다른 경우</h2>
              <p style={bodyStyle}>
                제공된 서비스가 표시·광고한 내용 또는 계약 내용과 다르게 이행된 경우에는 관련 법령이 정한 범위와 절차에 따라 청약철회 및 환불을 요청할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>7. 환불 처리</h2>
              <p style={bodyStyle}>
                환불 사유가 인정되는 경우 관련 법령과 결제수단의 처리 절차에 따라 환불합니다. 카드사 또는 결제수단에 따라 실제 환급이 반영되는 시점에는 차이가 있을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>8. 환불 문의</h2>
              <p style={bodyStyle}>
                환불이 필요한 경우 결제 확인에 필요한 정보와 함께 아래 이메일로 문의해 주세요.
              </p>
              <a
                href="mailto:molip.help@gmail.com"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  color: "#0b684d",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                molip.help@gmail.com
              </a>
            </section>
          </div>

          <div
            style={{
              marginTop: 48,
              padding: "22px 24px",
              background: "#eef4ef",
              borderLeft: "3px solid #0b684d",
            }}
          >
            <strong
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
              }}
            >
              결제 전 안내
            </strong>
            <p style={{ ...bodyStyle, margin: 0 }}>
              결제 후 개인별 분석 리포트 생성이 즉시 시작됩니다. 리포트 생성이 시작된 이후에는 관련 법령에 따라 단순 변심에 의한 환불이 제한될 수 있습니다. 결제 전 입력 정보를 확인해 주세요.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: 19,
  lineHeight: 1.45,
  letterSpacing: "-0.02em",
} as const;

const bodyStyle = {
  margin: "12px 0 0",
  color: "#4f5e56",
  fontSize: 15,
  lineHeight: 1.9,
} as const;

const listStyle = {
  margin: "14px 0 0",
  paddingLeft: 22,
  color: "#4f5e56",
  fontSize: 15,
  lineHeight: 1.9,
} as const;