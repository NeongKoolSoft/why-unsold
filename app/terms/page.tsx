import Link from "next/link";

export default function TermsPage() {
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
            TERMS OF SERVICE
          </p>

          <h1
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
            }}
          >
            이용약관
          </h1>

          <p
            style={{
              margin: "18px 0 0",
              color: "#66736c",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            시행일: 2026년 8월 25일
          </p>

          <div
            style={{
              marginTop: 42,
              display: "grid",
              gap: 36,
            }}
          >
            <section>
              <h2 style={sectionTitleStyle}>
                제1조 목적
              </h2>

              <p style={bodyStyle}>
                본 약관은 “왜 안 팔릴까”(이하 “서비스”)가 제공하는
                아파트 매도 분석 리포트 서비스의 이용과 관련하여
                서비스 제공자와 이용자 사이의 권리, 의무 및
                책임사항을 정하는 것을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제2조 서비스의 내용
              </h2>

              <p style={bodyStyle}>
                서비스는 국토교통부 공개 실거래 자료와 이용자가 직접
                입력한 매도 관련 정보를 바탕으로 아파트 매도 정체
                상황을 분석하고 참고용 리포트를 제공합니다.
              </p>

              <p style={bodyStyle}>
                리포트에는 가격 위치, 거래 유동성, 문의·방문 흐름,
                가능한 매도 병목, 가격 전략 시나리오 및 실행 계획
                등이 포함될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제3조 서비스의 성격
              </h2>

              <p style={bodyStyle}>
                본 서비스는 부동산 중개, 매매 알선, 감정평가 또는
                법률·세무 자문을 제공하는 서비스가 아닙니다.
              </p>

              <p style={bodyStyle}>
                제공되는 리포트는 공개 데이터와 이용자 입력 정보를
                바탕으로 한 참고용 분석이며, 특정 가격의 적정성을
                공식적으로 평가하거나 거래 성사를 보장하지 않습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제4조 이용자의 정보 입력
              </h2>

              <p style={bodyStyle}>
                이용자는 리포트 생성에 필요한 정보를 가능한 한
                정확하게 입력해야 합니다.
              </p>

              <p style={bodyStyle}>
                이용자가 잘못 입력하거나 누락한 정보로 인해 분석
                결과에 차이가 발생한 경우 서비스 제공자는 그에 따른
                결과를 보장하지 않습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제5조 공개 데이터의 이용
              </h2>

              <p style={bodyStyle}>
                서비스는 국토교통부 등 공공기관이 제공하는 공개
                데이터를 활용할 수 있습니다.
              </p>

              <p style={bodyStyle}>
                공개 데이터의 갱신 시점, 누락, 정정 또는 제공 방식의
                변경에 따라 서비스에 표시되는 정보와 실제 시장
                상황에는 차이가 있을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제6조 결제 및 서비스 제공
              </h2>

              <p style={bodyStyle}>
                유료 리포트의 가격과 결제 조건은 결제 화면에 표시된
                내용을 따릅니다.
              </p>

              <p style={bodyStyle}>
                결제가 정상적으로 완료되면 서비스는 결제 상태 및
                결제 금액을 확인한 뒤, 이용자가 입력한 정보와 조회된
                데이터를 바탕으로 개별 분석 리포트 생성을 시작합니다.
              </p>

              <p style={bodyStyle}>
                생성된 리포트는 이용자가 직접 저장·인쇄하여
                보관해야 하며, 브라우저 환경이나 이용 상태에 따라
                이후 동일한 리포트를 다시 확인하기 어려울 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제7조 취소 및 환불
              </h2>

              <p style={bodyStyle}>
                결제 취소와 환불은 서비스에 게시된 환불정책 및
                관련 법령에 따릅니다.
              </p>

              <Link
                href="/refund-policy"
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  color: "#0b684d",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                환불정책 보기
              </Link>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제8조 서비스 이용 제한
              </h2>

              <p style={bodyStyle}>
                이용자는 서비스를 불법적인 목적으로 이용하거나,
                서비스의 정상적인 운영을 방해하거나, 시스템에
                과도한 부하를 발생시키는 방식으로 이용해서는 안 됩니다.
              </p>

              <p style={bodyStyle}>
                서비스 제공자는 이러한 행위가 확인되는 경우 이용을
                제한하거나 필요한 조치를 취할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제9조 서비스의 변경 또는 중단
              </h2>

              <p style={bodyStyle}>
                서비스 제공자는 시스템 점검, 외부 데이터 제공 중단,
                기술적 장애 또는 서비스 개선을 위해 서비스의 일부를
                변경하거나 일시적으로 중단할 수 있습니다.
              </p>

              <p style={bodyStyle}>
                이미 결제한 리포트를 정상적으로 제공할 수 없는 경우에는
                환불정책에 따라 처리합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제10조 책임의 한계
              </h2>

              <p style={bodyStyle}>
                서비스 제공자는 리포트의 분석 내용을 바탕으로 이용자가
                내린 매도 여부, 가격 변경 또는 기타 매도 관련
                의사결정의 결과를 보장하지 않습니다.
              </p>

              <p style={bodyStyle}>
                부동산 시장 상황, 개별 매물의 상태, 거래 상대방의
                사정 등 서비스가 확인할 수 없는 요소에 따라 실제
                거래 결과는 달라질 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제11조 지식재산권
              </h2>

              <p style={bodyStyle}>
                서비스 화면, 문구, 분석 구성 및 서비스가 자체적으로
                제작한 콘텐츠에 관한 권리는 서비스 제공자에게 있습니다.
                다만 공공기관의 공개 데이터 등 제3자에게 권리가 있는
                자료는 해당 권리자의 정책을 따릅니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                제12조 문의
              </h2>

              <p style={bodyStyle}>
                서비스 이용과 관련한 문의는 아래 이메일로 접수할 수
                있습니다.
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
              서비스 이용 전 확인
            </strong>

            <p
              style={{
                ...bodyStyle,
                margin: 0,
              }}
            >
              본 서비스는 부동산 중개·감정평가 서비스가 아니며,
              공개 실거래 자료와 이용자 입력 정보를 바탕으로
              매도 상황을 분석하는 참고용 리포트를 제공합니다.
              생성된 리포트는 확인 후 직접 저장·인쇄하여
              보관해 주세요.
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