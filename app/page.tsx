import DiagnosisForm from "./diagnosis-form";

const signals = [
  { value: "29억 2,000만원", label: "최근 실거래" },
  { value: "34억 4,995만원", label: "경쟁 매물 최저가" },
  { value: "36억원", label: "현재 희망가" },
];

const businessInfo = {
  businessName: "넝쿨웍스",
  representative: "박경은",
  registrationNumber: "865-27-02154",
  address: "부산광역시 부산진구 부전로96번길 7, 401-S229호(부전동)",
  mailOrderNumber: "",
};

const hasBusinessInfo =
  businessInfo.businessName.trim().length > 0;

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="주요 메뉴">
        <a
          className="brand"
          href="#top"
          aria-label="왜 안 팔릴까 홈"
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            ?
          </span>
          <span>왜 안 팔릴까</span>
        </a>

        <a
          className="nav-link"
          href="#sample"
        >
          리포트 구성
        </a>
      </nav>

      <section
        className="hero"
        id="top"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            아파트 매도 정체 분석
          </p>

          <h1>
            시세 말고,
            <br />
            <strong>
              왜 안 팔리는지를
            </strong>
            <br />
            봅니다.
          </h1>

          <p className="hero-description">
            국토교통부 실거래 데이터와 현재 매도 상황을
            함께 분석해 가격·거래 유동성·문의 전환 중
            어디에서 막히는지 찾고, 다음 행동까지 정리합니다.
          </p>

          <div className="hero-actions">
            <a
              className="primary-button"
              href="#application"
            >
              매도 분석 리포트 만들기
            </a>

            <a
              className="text-button"
              href="#sample"
            >
              리포트 구성 보기{" "}
              <span aria-hidden="true">
                ↓
              </span>
            </a>
          </div>

          <p className="hero-trust-note">
            국토교통부 실거래 자동조회 · 1회 20,000원
          </p>

          <ul
            className="promise-list"
            aria-label="매도 분석 리포트 구성"
          >
            <li>
              <span>01</span>
              원인 진단
            </li>

            <li>
              <span>02</span>
              데이터 근거
            </li>

            <li>
              <span>03</span>
              전략과 실행
            </li>
          </ul>
        </div>

        <div
          className="hero-report"
          aria-label="리센츠 매도 분석 예시"
        >
          <div className="report-topline">
            <span className="report-label">
              분석 결과
            </span>

            <span className="report-code">
              SAMPLE REPORT
            </span>
          </div>

          <p className="report-address">
            서울 송파구 잠실동 · 리센츠 · 전용 84.99㎡
          </p>

          <div className="diagnosis-badge">
            <i />
            실제 리포트 미리보기
          </div>

          <h2>
            실거래 대비 높은 희망가로
            <br />
            <em>가격 경쟁력</em>이 낮아졌습니다.
          </h2>

          <p className="report-summary">
            최근 거래는 꾸준하지만 현재 희망가는 최근
            실거래와 입력한 경쟁 매물 최저가보다 높습니다.
            가격 차이가 초기 비교 단계에서 부담으로 작용할
            가능성이 큽니다.
          </p>

          <div className="signal-grid">
            {signals.map(
              (signal) => (
                <div
                  className="signal"
                  key={
                    signal.label
                  }
                >
                  <strong>
                    {signal.value}
                  </strong>

                  <span>
                    {signal.label}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="next-action">
            <span>
              핵심 병목
            </span>

            <p>
              가격 경쟁력
            </p>
          </div>

          <div className="next-action">
            <span>
              지금 우선할 것
            </span>

            <p>
              입력한 경쟁 매물 최저가와의 가격 차이를
              줄일 수 있는지 점검
            </p>
          </div>

          <p className="report-note">
            국토교통부 실거래 자동조회 · 사용자 입력 기반
            분석입니다. 거래 성사를 보장하지 않습니다.
          </p>
        </div>
      </section>

      <section
        className="difference-section"
        aria-labelledby="difference-title"
      >
        <div className="section-heading">
          <p className="section-index">
            01 / 분석 방식
          </p>

          <h2 id="difference-title">
            시세 하나가 아니라
            <br />
            매도가 막힌 지점을 봅니다.
          </h2>
        </div>

        <div className="difference-grid">
          <article>
            <span className="card-number">
              01
            </span>

            <h3>
              데이터로 확인합니다
            </h3>

            <p>
              국토교통부 실거래 자료를 조회해 최근
              실거래, 단지 거래량, 동일 면적 거래량과
              거래 공백을 먼저 확인합니다.
            </p>
          </article>

          <article>
            <span className="card-number">
              02
            </span>

            <h3>
              막힌 지점을 찾습니다
            </h3>

            <p>
              가격·거래 유동성·노출·문의 전환·현장
              조건 중 현재 데이터에서 가장 가능성이
              높은 매도 병목을 구분합니다.
            </p>
          </article>

          <article>
            <span className="card-number">
              03
            </span>

            <h3>
              행동으로 연결합니다
            </h3>

            <p>
              진단에서 끝내지 않고 가격 전략 3가지,
              30일 실행 계획과 전략을 유지·조정할
              판단 기준까지 정리합니다.
            </p>
          </article>
        </div>
      </section>

      <section
        className="sample-section"
        id="sample"
        aria-labelledby="sample-title"
      >
        <div className="section-heading light">
          <p className="section-index">
            02 / 리포트 구성
          </p>

          <h2 id="sample-title">
            무엇이 문제인지부터
            <br />
            무엇을 할지까지 보여드립니다.
          </h2>
        </div>

        <div className="sample-steps">
          <div className="sample-step-card">
            <span>1</span>

            <strong>
              종합 진단
            </strong>

            <p>
              현재 매도 정체에서 가장 가능성이 높은
              원인을 한 문장으로 먼저 정리합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>2</span>

            <strong>
              가격 위치
            </strong>

            <p>
              최근 실거래와 입력한 경쟁 매물 최저가를
              기준으로 현재 희망가의 위치를 비교합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>3</span>

            <strong>
              거래 유동성
            </strong>

            <p>
              단지 전체와 동일 면적 거래량, 거래 공백을
              확인해 실제 거래가 얼마나 자주 일어나는지 봅니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>4</span>

            <strong>
              매수 반응과 핵심 병목
            </strong>

            <p>
              문의·방문·협상 흐름을 함께 보고 가격·유동성·
              노출·전환 중 어디에서 막히는지 구분합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>5</span>

            <strong>
              가격 전략과 30일 실행
            </strong>

            <p>
              가격 유지·소폭 조정·적극 조정 시나리오와
              앞으로 30일 동안 확인할 행동을 정리합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>6</span>

            <strong>
              데이터 기준과 분석 한계
            </strong>

            <p>
              국토교통부 실거래 자동조회와 사용자 입력을
              기준으로 분석하며, 확인할 수 없는 정보는
              임의로 단정하지 않습니다.
            </p>
          </div>
        </div>
      </section>

      <section
        className="pricing-section"
        id="apply"
        aria-labelledby="pricing-title"
      >
        <div className="section-heading">
          <p className="section-index">
            03 / 분석 리포트
          </p>

          <h2 id="pricing-title">
            하나의 리포트로
            <br />
            매도 상황 전체를 봅니다.
          </h2>
        </div>

        <div className="pricing-cards">
          <div className="pricing-card featured">
            <span className="recommended">
              단일 분석 리포트
            </span>

            <div>
              <p className="plan-name">
                매도 분석 리포트
              </p>

              <p className="price">
                <strong>
                  20,000
                </strong>
                원
              </p>

              <p className="price-note">
                단지 한 곳 · 전용면적 한 유형 기준
              </p>
            </div>

            <ul>
              <li>
                가장 가능성 높은 매도 정체 원인
              </li>

              <li>
                실거래 기반 핵심 판단 근거
              </li>

              <li>
                가격 위치와 거래 유동성 분석
              </li>

              <li>
                문의·방문·협상 병목 진단
              </li>

              <li>
                가격 유지·조정 시나리오 3가지
              </li>

              <li>
                30일 실행 계획과 판단 트리거
              </li>

              <li>
                저장·인쇄 가능한 분석 리포트
              </li>
            </ul>

            <a
              className="primary-button dark"
              href="#application"
            >
              매도 분석 리포트 만들기
            </a>
          </div>
        </div>

        <ol
          className="order-flow"
          aria-label="분석 리포트 생성 순서"
        >
          <li>
            <span>01</span>

            <div>
              <strong>
                매도 상황 입력
              </strong>

              <p>
                아파트 정보와 희망가, 경쟁 매물,
                등록 기간, 알고 있는 매수 반응을
                입력합니다.
              </p>
            </div>
          </li>

          <li>
            <span>02</span>

            <div>
              <strong>
                실거래·시장 구조 분석
              </strong>

              <p>
                국토교통부 실거래 자료를 조회하고
                가격·거래량·유동성·매수 반응을
                종합합니다.
              </p>
            </div>
          </li>

          <li>
            <span>03</span>

            <div>
              <strong>
                분석 리포트 생성
              </strong>

              <p>
                판단 근거부터 병목 진단, 가격 전략,
                30일 실행 계획까지 하나의 리포트로
                생성합니다.
              </p>
            </div>
          </li>
        </ol>

        <p className="delivery-note">
          국토교통부 실거래 자료와 사용자 입력 정보를
          바탕으로 분석 리포트를 생성합니다.
        </p>
      </section>

      <section
        className="application-section"
        id="application"
        aria-label="매도 분석 리포트 신청서"
      >
        <DiagnosisForm />
      </section>

      <footer>
        <a
          className="brand footer-brand"
          href="#top"
        >
          <span className="brand-mark">
            ?
          </span>

          <span>
            왜 안 팔릴까
          </span>
        </a>

        <p>
          시세가 설명하지 못한 매도 정체를 데이터와
          AI로 분석합니다.
        </p>

        <div className="footer-links">
          <a href="/terms">
            이용약관
          </a>

          <a href="/privacy">
            개인정보처리방침
          </a>

          <a href="/refund-policy">
            환불정책
          </a>

          <a href="mailto:molip.help@gmail.com">
            molip.help@gmail.com
          </a>
        </div>

        {hasBusinessInfo && (
          <div className="business-info">
            <span>상호 {businessInfo.businessName}</span>

            <span>대표자 {businessInfo.representative}</span>

            <span>
              사업자등록번호 {businessInfo.registrationNumber}
            </span>

            <span>사업장 주소 {businessInfo.address}</span>

            {businessInfo.mailOrderNumber && (
              <span>
                통신판매업 신고번호 {businessInfo.mailOrderNumber}
              </span>
            )}
          </div>
        )}
      </footer>
    </main>
  );
}