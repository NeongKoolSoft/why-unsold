import Link from "next/link";

export default function PrivacyPolicyPage() {
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
            PRIVACY POLICY
          </p>

          <h1
            style={{
              margin: "14px 0 0",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.15,
              letterSpacing: "-0.04em",
            }}
          >
            개인정보처리방침
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
              <h2 style={sectionTitleStyle}>
                1. 개인정보의 처리 목적
              </h2>

              <p style={bodyStyle}>
                “왜 안 팔릴까”(이하 “서비스”)는 매도 분석 리포트
                제공, 결제 확인, 고객 문의 및 서비스 운영을 위해
                필요한 범위에서 개인정보를 처리합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                2. 수집하는 개인정보 항목
              </h2>

              <p style={bodyStyle}>
                서비스는 원칙적으로 동·호수, 소유자 성명, 주민등록번호
                등 부동산 소유자를 직접 식별하기 위한 정보를 요구하지
                않습니다.
              </p>

              <p style={bodyStyle}>
                서비스 이용 과정에서 아래 정보가 처리될 수 있습니다.
              </p>

              <ul style={listStyle}>
                <li>
                  고객 문의 시 제공한 이메일 주소 및 문의 내용
                </li>
                <li>
                  결제 시 결제대행사를 통해 전달되는 결제 식별정보 및
                  결제 처리에 필요한 정보
                </li>
                <li>
                  서비스 이용 과정에서 자동 생성되는 접속 기록,
                  오류 기록 등 기술적 정보
                </li>
              </ul>

              <p style={bodyStyle}>
                아파트 단지명, 법정동, 전용면적, 희망 매도가,
                경쟁 매물 가격, 문의·방문·협상 횟수 등은
                매도 분석을 위한 입력 정보로 처리됩니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                3. 개인정보의 처리 및 보유 기간
              </h2>

              <p style={bodyStyle}>
                개인정보는 처리 목적이 달성된 후 지체 없이 파기하는
                것을 원칙으로 합니다. 다만 관계 법령에 따라 일정 기간
                보관할 의무가 있는 경우에는 해당 기간 동안 보관할 수
                있습니다.
              </p>

              <p style={bodyStyle}>
                결제 및 거래 관련 기록은 전자상거래 등 관련 법령에서
                정한 기간 동안 보관될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                4. 개인정보의 제3자 제공
              </h2>

              <p style={bodyStyle}>
                서비스는 이용자의 개인정보를 원칙적으로 제3자에게
                제공하지 않습니다.
              </p>

              <p style={bodyStyle}>
                다만 이용자의 동의가 있거나 법령에 근거가 있는 경우,
                또는 결제 처리 등 서비스 제공에 필요한 범위에서는
                관련 사업자에게 정보가 제공될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                5. 개인정보 처리의 위탁
              </h2>

              <p style={bodyStyle}>
                서비스 운영을 위해 결제, 호스팅, 클라우드 및 AI 분석
                관련 외부 서비스를 이용할 수 있습니다.
              </p>

              <p style={bodyStyle}>
                실제 위탁업체 및 위탁 내용은 정식 결제 시스템과 운영
                환경이 확정된 후 본 방침에 구체적으로 반영합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                6. AI 분석을 위한 정보 처리
              </h2>

              <p style={bodyStyle}>
                매도 분석 리포트 생성을 위해 이용자가 입력한 매도 정보와
                공개 실거래 자료의 일부가 AI 분석 시스템에 전달될 수
                있습니다.
              </p>

              <p style={bodyStyle}>
                서비스는 분석에 불필요한 개인정보를 입력하지 않도록
                안내하며, 동·호수나 소유자 정보 등 직접 식별정보를
                수집 대상으로 하지 않습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                7. 개인정보의 파기
              </h2>

              <p style={bodyStyle}>
                보유 기간이 경과하거나 처리 목적이 달성되어 개인정보가
                불필요하게 된 경우에는 복구 또는 재생되지 않도록
                안전한 방법으로 파기합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                8. 이용자의 권리
              </h2>

              <p style={bodyStyle}>
                이용자는 관련 법령이 정하는 범위에서 자신의 개인정보에
                대한 열람, 정정, 삭제 또는 처리정지를 요청할 수 있습니다.
              </p>

              <p style={bodyStyle}>
                관련 요청은 아래 문의 이메일을 통해 접수할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                9. 개인정보의 안전성 확보 조치
              </h2>

              <p style={bodyStyle}>
                서비스는 개인정보의 분실, 도난, 유출, 변조 또는 훼손을
                방지하기 위해 접근 권한 관리, 안전한 통신 및 서비스
                운영에 필요한 기술적·관리적 조치를 적용합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                10. 개인정보 보호 관련 문의
              </h2>

              <p style={bodyStyle}>
                개인정보 처리와 관련한 문의, 열람·정정·삭제 등의
                요청은 아래 이메일로 접수해 주세요.
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

            <section>
              <h2 style={sectionTitleStyle}>
                11. 개인정보처리방침의 변경
              </h2>

              <p style={bodyStyle}>
                본 방침의 내용이 변경되는 경우 서비스 화면을 통해
                변경 내용을 안내합니다.
              </p>
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
              입력 정보 안내
            </strong>

            <p
              style={{
                ...bodyStyle,
                margin: 0,
              }}
            >
              매도 분석에는 동·호수, 소유자 성명, 전화번호와 같은
              직접 식별정보가 필요하지 않습니다. 분석 입력란에 이러한
              정보를 입력하지 마세요.
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