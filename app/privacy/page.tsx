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
                서비스는 원칙적으로 동·호수, 소유자 성명,
                주민등록번호 등 부동산 소유자를 직접 식별하기 위한
                정보를 요구하지 않습니다.
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
                다만 이용자가 사전에 동의한 경우 또는 관계 법령에
                따라 제공이 요구되는 경우에는 필요한 범위에서
                개인정보를 제공할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                5. 개인정보 처리의 위탁
              </h2>

              <p style={bodyStyle}>
                서비스는 원활한 서비스 제공을 위해 다음과 같이
                개인정보 처리 업무의 일부를 외부 사업자에게
                위탁할 수 있습니다.
              </p>

              <div style={processorListStyle}>
                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    주식회사 코리아포트원
                  </strong>

                  <p style={processorDescriptionStyle}>
                    위탁 업무: 결제 연동, 결제 요청 및 결제 상태 확인
                  </p>
                </div>

                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    엔에이치엔케이씨피 주식회사
                  </strong>

                  <p style={processorDescriptionStyle}>
                    위탁 업무: 신용·체크카드, 실시간 계좌이체 등
                    전자결제 처리 및 결제 관련 업무
                  </p>
                </div>

                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    Vercel Inc.
                  </strong>

                  <p style={processorDescriptionStyle}>
                    위탁 업무: 웹서비스 호스팅, 서버 실행,
                    접속 및 오류 처리 등 서비스 운영 인프라 제공
                  </p>
                </div>

                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    Google LLC
                  </strong>

                  <p style={processorDescriptionStyle}>
                    위탁 업무: Gemini API를 이용한 AI 기반
                    매도 분석 리포트 생성
                  </p>
                </div>
              </div>

              <p style={bodyStyle}>
                수탁업체는 위탁 업무 수행에 필요한 범위에서만 정보를
                처리하며, 위탁 관계가 종료되거나 처리 목적이 달성된
                경우 관련 법령 및 각 사업자의 보관 정책에 따라
                정보를 삭제 또는 보관합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                6. 개인정보의 국외 이전
              </h2>

              <p style={bodyStyle}>
                서비스 운영 과정에서 해외에 위치한 클라우드 및
                AI 서비스 사업자의 시스템을 이용함에 따라 정보가
                국외에서 처리될 수 있습니다.
              </p>

              <div style={processorListStyle}>
                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    Vercel Inc.
                  </strong>

                  <ul style={compactListStyle}>
                    <li>이전 국가: 미국 등 서비스 처리 지역</li>
                    <li>
                      이전 항목: 접속 기록, IP 주소, 오류 및 서비스
                      운영 과정에서 생성되는 기술적 정보
                    </li>
                    <li>
                      이전 목적: 웹서비스 호스팅 및 서비스 운영
                    </li>
                    <li>
                      이전 시점 및 방법: 서비스 이용 시
                      네트워크를 통한 전송
                    </li>
                    <li>
                      보유 기간: 서비스 제공 목적 달성 또는
                      위탁 관계 종료 시까지. 다만 관계 법령 또는
                      사업자의 정책에 따라 필요한 기간 보관될 수 있음
                    </li>
                  </ul>
                </div>

                <div style={processorItemStyle}>
                  <strong style={processorNameStyle}>
                    Google LLC
                  </strong>

                  <ul style={compactListStyle}>
                    <li>
                      이전 국가: 미국을 포함하여 Google이
                      데이터 처리시설을 운영하는 국가
                    </li>
                    <li>
                      이전 항목: AI 분석에 필요한 매도 분석 입력 정보
                      및 공개 실거래 자료
                    </li>
                    <li>
                      이전 목적: Gemini API를 이용한 매도 분석
                      리포트 생성
                    </li>
                    <li>
                      이전 시점 및 방법: 리포트 생성 시
                      암호화된 네트워크를 통한 전송
                    </li>
                    <li>
                      보유 기간: 서비스 제공 및 처리 목적 달성에
                      필요한 기간 또는 Google의 관련 서비스 정책에
                      따른 기간
                    </li>
                  </ul>
                </div>
              </div>

              <p style={bodyStyle}>
                이용자는 서비스 이용을 중단함으로써 국외 이전을
                거부할 수 있습니다. 다만 국외 처리 서비스는
                서비스 제공을 위한 기술적 기반으로 사용되므로,
                국외 이전을 거부하는 경우 매도 분석 리포트 제공이
                제한될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                7. AI 분석을 위한 정보 처리
              </h2>

              <p style={bodyStyle}>
                매도 분석 리포트 생성을 위해 이용자가 입력한 매도
                정보와 공개 실거래 자료의 일부가 AI 분석 시스템에
                전달됩니다.
              </p>

              <p style={bodyStyle}>
                서비스는 AI 분석에 동·호수, 소유자 성명,
                전화번호, 주민등록번호 등 직접 식별정보가
                필요하지 않도록 설계하고 있으며 이러한 정보를
                수집 대상으로 하지 않습니다.
              </p>

              <p style={bodyStyle}>
                이용자는 분석 입력란에 개인을 직접 식별할 수 있는
                정보를 입력하지 않아야 합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                8. 개인정보의 파기
              </h2>

              <p style={bodyStyle}>
                보유 기간이 경과하거나 처리 목적이 달성되어
                개인정보가 불필요하게 된 경우에는 복구 또는
                재생되지 않도록 안전한 방법으로 파기합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                9. 이용자의 권리
              </h2>

              <p style={bodyStyle}>
                이용자는 관련 법령이 정하는 범위에서 자신의
                개인정보에 대한 열람, 정정, 삭제 또는 처리정지를
                요청할 수 있습니다.
              </p>

              <p style={bodyStyle}>
                관련 요청은 아래 문의 이메일을 통해 접수할 수
                있습니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                10. 개인정보의 안전성 확보 조치
              </h2>

              <p style={bodyStyle}>
                서비스는 개인정보의 분실, 도난, 유출, 변조 또는
                훼손을 방지하기 위해 접근 권한 관리, 안전한 통신 및
                서비스 운영에 필요한 기술적·관리적 조치를
                적용합니다.
              </p>
            </section>

            <section>
              <h2 style={sectionTitleStyle}>
                11. 개인정보 보호 관련 문의
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
                12. 개인정보처리방침의 변경
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
              매도 분석에는 동·호수, 소유자 성명, 전화번호,
              주민등록번호와 같은 직접 식별정보가 필요하지 않습니다.
              분석 입력란에 이러한 정보를 입력하지 마세요.
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

const processorListStyle = {
  display: "grid",
  gap: 12,
  marginTop: 18,
} as const;

const processorItemStyle = {
  padding: "18px 20px",
  border: "1px solid #d9ddd7",
  background: "#f8f9f6",
} as const;

const processorNameStyle = {
  display: "block",
  color: "#17231d",
  fontSize: 14,
  lineHeight: 1.6,
} as const;

const processorDescriptionStyle = {
  margin: "7px 0 0",
  color: "#5f6d65",
  fontSize: 14,
  lineHeight: 1.75,
} as const;

const compactListStyle = {
  margin: "10px 0 0",
  paddingLeft: 20,
  color: "#5f6d65",
  fontSize: 14,
  lineHeight: 1.8,
} as const;