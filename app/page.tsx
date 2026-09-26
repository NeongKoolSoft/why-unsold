
"use client";

import { useEffect, useRef } from "react";

const samplePrices = {
  latestTrade: "29억 2,000만원",
  lowestListing: "34억 4,995만원",
  askingPrice: "36억원",
};

const sampleEvidence = [
  {
    label: "실거래 대비",
    title: "희망가가 비교 거래가격보다 높습니다.",
    description:
      "예시 희망가는 예시 실거래가격보다 6억 8,000만원 높습니다. 거래 시점과 층·방향 등 조건을 함께 확인해야 합니다.",
  },
  {
    label: "경쟁 매물 대비",
    title: "입력한 경쟁 매물 최저가보다 높습니다.",
    description:
      "예시 희망가는 입력한 경쟁 매물 최저가보다 1억 5,005만원 높습니다. 실제로 비교 가능한 매물인지 먼저 확인해야 합니다.",
  },
  {
    label: "매수 반응",
    title: "가격 차이만으로 정체 원인을 확정할 수 없습니다.",
    description:
      "문의·방문·협상 횟수가 제시되지 않은 예시입니다. 실제 진단에서는 입력된 매수 반응을 함께 살펴봅니다.",
  },
];

const sampleCauses = [
  {
    label: "주요 점검 요인",
    title: "가격 경쟁력",
    description:
      "희망가가 두 비교 가격보다 높아, 매수자가 다른 매물과 비교할 때 가격 차이가 영향을 주는지 확인할 필요가 있습니다.",
  },
  {
    label: "함께 볼 신호",
    title: "비교 매물의 조건",
    description:
      "면적뿐 아니라 층·방향·수리 상태·입주 가능일이 비슷한지 확인해야 가격 차이를 제대로 해석할 수 있습니다.",
  },
  {
    label: "추가 확인 필요",
    title: "실제 문의와 방문",
    description:
      "가격 차이를 확인한 뒤에도 매수 반응을 기록해야 가격·노출·방문 전환 중 어느 단계가 막혔는지 구분할 수 있습니다.",
  },
];

const sampleActions = [
  "최근 실거래의 계약 시점과 층·방향 등 비교 조건 확인",
  "입력한 경쟁 매물의 실제 등록 여부와 가격·조건 비교",
  "중개업소에 최근 문의·방문 횟수를 확인하고 기록",
];

const businessInfo = {
  businessName: "넝쿨웍스",
  representative: "박경은",
  registrationNumber: "865-27-02154",
  address:
    "부산광역시 부산진구 부전로96번길 7, 401-S229호(부전동)",
  phone: "010-3316-9786",
  mailOrderNumber: "2026-부산진구-1211",
};

const hasBusinessInfo =
  businessInfo.businessName.trim().length > 0;

function trackGa4Event(eventName: string) {
  if (typeof window === "undefined") return;

  const gtag = (
    window as Window & {
      gtag?: (...args: unknown[]) => void;
    }
  ).gtag;

  gtag?.("event", eventName);
}

export default function Home() {
  const diagnosisProductRef = useRef<HTMLDivElement>(null);
  const executionStrategyProductRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observedCards = [
      {
        element: diagnosisProductRef.current,
        eventName: "diagnosis_product_view",
      },
      {
        element: executionStrategyProductRef.current,
        eventName: "execution_strategy_product_view",
      },
    ];

    const viewed = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.5
          ) {
            return;
          }

          const eventName = entry.target.getAttribute(
            "data-view-event"
          );

          if (!eventName || viewed.has(eventName)) return;

          viewed.add(eventName);
          trackGa4Event(eventName);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    observedCards.forEach(({ element, eventName }) => {
      if (!element) return;

      element.setAttribute("data-view-event", eventName);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <nav
        className="nav-shell"
        aria-label="주요 메뉴"
      >
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
          <span>왜 안 팔릴까?</span>
        </a>

        <a
          className="nav-link"
          href="#products"
        >
          상품 선택
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
            아파트 매도 진단
          </p>

          <h1>
            내 아파트,
            <br />
            <strong>지금 어떻게 팔아야 할까?</strong>
          </h1>

          <p className="hero-description">
            매물은 내놓았는데 문의가 없거나 거래가 지연되고 있나요?
            <br className="desktop-break" />
            실거래와 거래 흐름, 경쟁 매물 및 매수 반응을 함께 살펴
            현재 막힌 지점과 다음 행동을 정리합니다.
          </p>

          <div className="hero-choice-list">
            <div className="hero-choice">
              <div className="hero-choice-copy">
                <span>가격 차이만으로 판단이 어렵다면</span>
                <strong>
                  왜 안 팔리는지, 무엇부터 확인해야 할지 알아보세요.
                </strong>
              </div>

              <a
                className="primary-button hero-choice-button"
                href="#diagnosis-product"
                onClick={() =>
                  trackGa4Event("diagnosis_cta_click")
                }
              >
                내 아파트 매도 정체 진단하기
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <p className="hero-trust-note">
            국토교통부 실거래 자동조회
          </p>

          <a
            className="free-entry-hero"
            href="/free-price-check"
            onClick={() =>
              trackGa4Event("free_price_check_cta_click")
            }
          >
            먼저 무료로 희망가격과 실거래 비교하기
            <span aria-hidden="true">→</span>
          </a>

        </div>

        {/* =====================================================
            리센츠 샘플 리포트 — 대시보드형
            설명용 예시이며 현재 시세를 뜻하지 않습니다.
        ====================================================== */}
        <div className="sample-report-column">
          <div
            className="hero-report sample-dashboard"
            aria-label="서울 잠실 리센츠 매도 정체 진단 샘플 리포트"
          >
          <div className="sample-dashboard-topline">
            <div className="sample-dashboard-topline-copy">
              <span
                className="sample-dashboard-top-icon"
                aria-hidden="true"
              >
                ▥
              </span>

              <div>
                <strong>
                  실제 진단에서는 이런 점을 확인합니다
                </strong>
                <p>
                  서울 송파구 잠실동 · 리센츠 · 전용 84.99㎡
                </p>
              </div>
            </div>

            <span className="sample-dashboard-code">
              SAMPLE REPORT
            </span>
          </div>

          <div className="sample-dashboard-hero">
            <span className="sample-dashboard-badge">
              매도 정체 진단 예시
            </span>

            <h2>
              희망가가 비교 기준보다 높아
              <br />
              <em>가격 경쟁력 점검이 필요합니다.</em>
            </h2>

            <p className="sample-dashboard-summary">
              예시 희망가는 예시 실거래가격과 입력한 경쟁 매물
              최저가보다 높습니다. 다만 가격 차이만으로 문의가
              없는 이유를 확정할 수는 없습니다. 비교 매물의
              조건과 실제 매수 반응을 함께 확인해야 합니다.
            </p>

            <div className="sample-dashboard-reason">
              <strong>현재 먼저 점검할 요인</strong>
              <span>희망가와 비교 가격의 차이</span>
            </div>
          </div>

          <div className="sample-dashboard-price-grid">
            <div className="sample-dashboard-price-card sample-dashboard-trade">
              <span>▥ 최근 실거래</span>
              <strong>{samplePrices.latestTrade}</strong>
              <p>설명용 예시 거래가격</p>
            </div>

            <div className="sample-dashboard-price-card sample-dashboard-listing">
              <span>◇ 경쟁 매물 최저가</span>
              <strong>{samplePrices.lowestListing}</strong>
              <p>예시로 입력한 매물 호가</p>
            </div>

            <div className="sample-dashboard-price-card sample-dashboard-asking">
              <span>◎ 현재 희망가</span>
              <strong>{samplePrices.askingPrice}</strong>
              <p>예시로 입력한 희망가격</p>
            </div>
          </div>

          <section className="sample-dashboard-panel">
            <div className="sample-dashboard-section-title">
              <strong>▥ 핵심 근거 3가지</strong>
              <span>가격 차이와 확인이 필요한 정보를 구분합니다.</span>
            </div>

            <div className="sample-dashboard-evidence-grid">
              {sampleEvidence.map((item, index) => (
                <div
                  className="sample-dashboard-evidence-card"
                  key={item.label}
                >
                  <div className="sample-dashboard-card-heading">
                    <span>{index + 1}</span>
                    <strong>{item.label}</strong>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="sample-dashboard-panel sample-dashboard-cause-panel">
            <div className="sample-dashboard-section-title">
              <strong>◎ 원인 분석</strong>
              <span>점검할 요인과 아직 모르는 정보를 구분합니다.</span>
            </div>

            <div className="sample-dashboard-cause-list">
              {sampleCauses.map((item, index) => (
                <div
                  className="sample-dashboard-cause-row"
                  key={item.label}
                >
                  <span className="sample-dashboard-number">
                    {index + 1}
                  </span>

                  <div>
                    <div className="sample-dashboard-cause-heading">
                      <strong>{item.label}</strong>
                      <span>{item.title}</span>
                    </div>

                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="sample-dashboard-panel sample-dashboard-action-panel">
            <div className="sample-dashboard-section-title">
              <strong>▤ 지금 할 일</strong>
              <span>다음 판단을 위해 먼저 확인할 행동입니다.</span>
            </div>

            <div className="sample-dashboard-action-grid">
              {sampleActions.map((action, index) => (
                <div
                  className="sample-dashboard-action-card"
                  key={action}
                >
                  <span className="sample-dashboard-number">
                    {index + 1}
                  </span>

                  <strong>{action}</strong>
                </div>
              ))}
            </div>
          </section>


          <p className="sample-dashboard-disclaimer">
            설명용 입력값으로 만든 구성 예시 · 현재 시세 또는
            실제 매물 진단 결과가 아닙니다.
          </p>

          <div className="sample-dashboard-footer">
            <span>데이터 + AI 기반 매도 분석</span>
            <span>거래 성사를 보장하지 않습니다.</span>
          </div>
        </div>


        <div className="sample-report-notice">
          <span className="sample-report-notice-icon" aria-hidden="true">
            +
          </span>

          <div className="sample-report-notice-content">
            <span className="sample-report-notice-label">
              샘플 리포트 안내
            </span>

            <strong className="sample-report-notice-title">
              실제 리포트는 상세 분석 6페이지가 더 제공됩니다.
            </strong>

            <p>
              현재 화면은 첫 페이지의 구성 예시입니다.
              실제 구매 시 가격·시장 해석, 거래 유동성,
              매수 반응과 병목 진단, 가격 전략과 실행 계획 등을
              추가로 확인할 수 있습니다.
            </p>

            <span className="sample-report-notice-pages">
              현재 리포트 구성 기준 · 총 7페이지
            </span>
          </div>
        </div>      
        </div>
      </section>

      <section
        className="sample-section"
        id="sample"
        aria-labelledby="sample-title"
      >
        <div className="section-heading light">
          <p className="section-index">
            01 / 제공 내용
          </p>

          <h2 id="sample-title">
            왜 안 팔리는지 진단하고,
            <br />
            다음 행동까지 정리합니다.
          </h2>
        </div>

        <div className="sample-steps">
          <div className="sample-step-card">
            <span>1</span>

            <strong>정체 원인 진단</strong>

            <p>
              가격·거래 유동성·노출·문의 전환·현장 조건 중
              가장 가능성이 높은 매도 병목을 구분합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>2</span>

            <strong>가격 전략</strong>

            <p>
              실거래와 경쟁 매물, 문의와 방문 흐름을
              바탕으로 가격 유지·소폭 조정·적극 조정
              시나리오를 비교합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>3</span>

            <strong>30일 실행 순서</strong>

            <p>
              진단 결과를 기준으로 1주차부터 4주차까지
              확인하고 실행할 행동을 순서대로 정리합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>4</span>

            <strong>유지·조정 판단 기준</strong>

            <p>
              문의·방문·협상 반응이 어떻게 변할 때
              현재 전략을 유지하고 언제 조정할지
              판단 트리거를 제시합니다.
            </p>
          </div>
        </div>
      </section>

      <section
        className="pricing-section"
        id="products"
        aria-labelledby="pricing-title"
      >
        <div className="section-heading">
          <p className="section-index">
            02 / 상품 선택
          </p>

          <h2 id="pricing-title">
            현재 매도 상황에 맞는
            <br />
            진단과 실행전략을 선택하세요.
          </h2>
        </div>

        <div className="free-entry-card">
          <div>
            <span>무료 · 간단 확인</span>

            <strong>
              내 아파트 희망가격, 최근 실거래와 얼마나 차이 날까?
            </strong>

            <p>
              동일 면적 실거래 한 건과의 차이를 먼저 확인합니다.
              적정 매도가나 정체 원인 진단은 포함되지 않습니다.
            </p>
          </div>

          <a
            href="/free-price-check"
            onClick={() =>
              trackGa4Event("free_price_check_product_click")
            }
          >
            무료 가격 확인하기
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="pricing-cards">
          <div
            ref={diagnosisProductRef}
            className="pricing-card featured"
            id="diagnosis-product"
          >
            <span className="recommended">
              진단
            </span>

            <div>
              <p className="plan-name">
                매도 정체 진단
              </p>

              <p className="price">
                <strong>9,900</strong>원
              </p>

              <p className="price-note">
                단지 한 곳 · 전용면적 한 유형 기준
              </p>
            </div>

            <ul>
              <li>가장 가능성 높은 매도 정체 원인</li>
              <li>실거래 기반 핵심 판단 근거</li>
              <li>가격 위치와 거래 유동성 분석</li>
              <li>문의·방문·협상 병목 진단</li>
              <li>가격 유지·조정 시나리오 3가지</li>
              <li>다음에 확인할 핵심 정보</li>
              <li>저장·인쇄 가능한 분석 리포트</li>
            </ul>

            <a
              className="primary-button dark"
              href="/diagnosis"
              onClick={() =>
                trackGa4Event("diagnosis_product_click")
              }
            >
              매도 정체 진단 시작하기
            </a>
          </div>

          <div
            className="pricing-card"
            ref={executionStrategyProductRef}
          >
            <span className="recommended">
              진단 후 실행
            </span>

            <div>
              <p className="plan-name">
                30일 실행전략
              </p>

              <p className="price">
                <strong>14,500</strong>원
              </p>

              <p className="price-note">
                기존 매도 진단 결과 한 건 기준
              </p>
            </div>

            <ul>
              <li>진단 결과 기반 실행 우선순위</li>
              <li>1주차부터 4주차까지 실행 계획</li>
              <li>중개사·노출·가격 점검 행동</li>
              <li>문의·방문·협상 반응 기록 기준</li>
              <li>전략 유지·조정 판단 트리거</li>
              <li>다음 재점검 시점</li>
              <li>저장·인쇄 가능한 실행전략</li>
            </ul>

            <a
              className="primary-button dark"
              href="/execution-strategy"
              onClick={() =>
                trackGa4Event("execution_strategy_product_click")
              }
            >
              30일 실행전략 시작하기
            </a>
          </div>
        </div>

        <ol
          className="order-flow"
          aria-label="아파트 매도 진단 이용 순서"
        >
          <li>
            <span>01</span>

            <div>
              <strong>매도 정체 진단</strong>

              <p>
                이미 매도 중이라면 경쟁 매물과 매수 반응을
                함께 분석해 현재 막힌 지점을 진단합니다.
              </p>
            </div>
          </li>

          <li>
            <span>02</span>

            <div>
              <strong>진단 후 실행</strong>

              <p>
                정체 진단을 받은 뒤에는 30일 실행전략으로
                행동 순서와 전략 조정 기준을 구체화합니다.
              </p>
            </div>
          </li>
        </ol>

        <p className="delivery-note">
          각 상품은 별도 1회 결제 상품입니다.
          필요한 단계의 진단만 선택해 이용할 수 있습니다.
        </p>
      </section>

      <footer>
        <a
          className="brand footer-brand"
          href="#top"
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            ?
          </span>

          <span>왜 안 팔릴까?</span>
        </a>

        <p>
          매도 정체 원인부터 진단 후 30일 실행까지,
          데이터와 AI로 분석합니다.
        </p>

        <div className="footer-links">
          <a href="/terms">이용약관</a>
          <a href="/privacy">개인정보처리방침</a>
          <a href="/refund-policy">환불정책</a>
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
            <span>전화번호 {businessInfo.phone}</span>

            {businessInfo.mailOrderNumber && (
              <span>
                통신판매업 신고번호{" "}
                {businessInfo.mailOrderNumber}
              </span>
            )}
          </div>
        )}
      </footer>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        #diagnosis-product {
          scroll-margin-top: 24px;
        }

        /* =====================================================
           LANDING — SAMPLE REPORT DASHBOARD
           기존 hero-report 스타일보다 구체적인 선택자로 지정합니다.
        ===================================================== */

        .hero-report.sample-dashboard {
          display: flex;
          flex-direction: column;
          gap: 0;
          min-width: 0;
          padding: 17px;
          overflow: visible;
          border: 1px solid #d8e6da;
          border-radius: 15px;
          background: #fff;
          color: #294637;
          box-shadow: 0 15px 35px rgba(21, 67, 41, 0.08);
        }

        .sample-dashboard,
        .sample-dashboard * {
          box-sizing: border-box;
        }

        .sample-dashboard-topline {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 9px;
          padding-bottom: 12px;
          border-bottom: 1px solid #d9e5db;
        }

        .sample-dashboard-topline-copy {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .sample-dashboard-top-icon {
          display: grid;
          width: 29px;
          height: 29px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #e1f2e7;
          color: #156b50;
          font-size: 16px;
          font-weight: 800;
        }

        .sample-dashboard-topline-copy strong {
          display: block;
          color: #244c39;
          font-size: 11px;
          line-height: 1.45;
        }

        .sample-dashboard-topline-copy p {
          margin: 3px 0 0;
          color: #68796e;
          font-size: 10px;
          line-height: 1.45;
          word-break: keep-all;
        }

        .sample-dashboard-code {
          flex: 0 0 auto;
          color: #27684f;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.03em;
        }

        .sample-dashboard-hero {
          margin-top: 11px;
          padding: 15px;
          border: 1px solid #d4e8d9;
          border-radius: 9px;
          background: linear-gradient(
            125deg,
            #fff 12%,
            #e7f5ee 100%
          );
        }

        .sample-dashboard-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 20px;
          background: #dff2e5;
          color: #176447;
          font-size: 10px;
          font-weight: 800;
        }

        .hero-report.sample-dashboard .sample-dashboard-hero h2 {
          margin: 10px 0 0;
          color: #173f2d;
          font-size: clamp(20px, 2.1vw, 30px);
          line-height: 1.27;
          letter-spacing: -0.045em;
          word-break: keep-all;
        }

        .hero-report.sample-dashboard .sample-dashboard-hero h2 em {
          color: #11684b;
          font-style: normal;
        }

        .sample-dashboard-summary {
          margin: 10px 0 0;
          color: #506759;
          font-size: 11px;
          line-height: 1.7;
          word-break: keep-all;
        }

        .sample-dashboard-reason {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 5px 9px;
          margin-top: 11px;
          padding-top: 9px;
          border-top: 1px solid #d6e5dc;
          font-size: 10px;
          line-height: 1.5;
        }

        .sample-dashboard-reason strong {
          color: #126248;
        }

        .sample-dashboard-reason span {
          color: #496355;
        }

        .sample-dashboard-price-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-top: 9px;
        }

        .sample-dashboard-price-card {
          min-width: 0;
          padding: 10px 9px;
          border: 1px solid #e5e9e4;
          border-radius: 8px;
        }

        .sample-dashboard-trade {
          background: #ecf7f1;
        }

        .sample-dashboard-listing {
          background: #fff5e9;
        }

        .sample-dashboard-asking {
          background: #fff0ee;
        }

        .sample-dashboard-price-card > span {
          display: block;
          color: #4b6254;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.45;
        }

        .sample-dashboard-price-card > strong {
          display: block;
          margin-top: 6px;
          color: #205640;
          font-size: clamp(12px, 1.35vw, 18px);
          line-height: 1.3;
          letter-spacing: -0.04em;
          word-break: keep-all;
        }

        .sample-dashboard-listing > strong {
          color: #81591f;
        }

        .sample-dashboard-asking > strong {
          color: #a43d35;
        }

        .sample-dashboard-price-card > p {
          margin: 5px 0 0;
          color: #708078;
          font-size: 9px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .sample-dashboard-panel {
          margin-top: 9px;
          padding: 10px;
          border: 1px solid #e8eadf;
          border-radius: 9px;
          background: #faf8ed;
        }

        .sample-dashboard-section-title {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 7px;
          margin-bottom: 9px;
        }

        .sample-dashboard-section-title strong {
          color: #284e3c;
          font-size: 12px;
          line-height: 1.4;
        }

        .sample-dashboard-section-title > span {
          max-width: 48%;
          color: #838779;
          font-size: 9px;
          line-height: 1.4;
          text-align: right;
          word-break: keep-all;
        }

        .sample-dashboard-evidence-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
        }

        .sample-dashboard-evidence-card {
          min-width: 0;
          padding: 10px 8px;
          border: 1px solid #ebe9df;
          border-radius: 7px;
          background: #fff;
        }

        .sample-dashboard-card-heading {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sample-dashboard-card-heading > span,
        .sample-dashboard-number {
          display: grid;
          width: 18px;
          height: 18px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #12674c;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
        }

        .sample-dashboard-card-heading > strong {
          color: #42604e;
          font-size: 10px;
        }

        .sample-dashboard-evidence-card h3 {
          margin: 8px 0 0;
          color: #294737;
          font-size: 11px;
          line-height: 1.45;
          word-break: keep-all;
        }

        .sample-dashboard-evidence-card p {
          margin: 7px 0 0;
          color: #66756a;
          font-size: 9px;
          line-height: 1.55;
          word-break: keep-all;
        }

        .sample-dashboard-cause-panel {
          background: #f5f8ef;
        }

        .sample-dashboard-cause-list {
          display: grid;
          gap: 6px;
        }

        .sample-dashboard-cause-row {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          min-width: 0;
          padding: 9px;
          border: 1px solid #e4eae0;
          border-radius: 6px;
          background: #fff;
        }

        .sample-dashboard-cause-heading {
          display: flex;
          flex-wrap: wrap;
          gap: 3px 7px;
          align-items: baseline;
        }

        .sample-dashboard-cause-heading strong {
          color: #1e513b;
          font-size: 10px;
        }

        .sample-dashboard-cause-heading span {
          color: #4c6657;
          font-size: 10px;
          font-weight: 700;
        }

        .sample-dashboard-cause-row p {
          margin: 5px 0 0;
          color: #66766b;
          font-size: 9px;
          line-height: 1.55;
          word-break: keep-all;
        }

        .sample-dashboard-action-panel {
          background: #fbf7e9;
        }

        .sample-dashboard-action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
        }

        .sample-dashboard-action-card {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          min-width: 0;
          padding: 10px 8px;
          border: 1px solid #ece8d9;
          border-radius: 7px;
          background: #fff;
        }

        .sample-dashboard-action-card strong {
          min-width: 0;
          color: #394c3d;
          font-size: 10px;
          line-height: 1.55;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }

        .sample-dashboard-disclaimer {
          margin: 10px 0 0;
          color: #69766c;
          font-size: 10px;
          line-height: 1.6;
          word-break: keep-all;
        }

        .sample-dashboard-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
          padding-top: 9px;
          border-top: 1px solid #d9e5db;
          color: #748178;
          font-size: 9px;
          line-height: 1.45;
        }


        .sample-dashboard-more {
          margin-top: 12px;
          padding: 13px 14px;
          border: 1px solid #cfe4d5;
          border-radius: 9px;
          background: #edf7f0;
        }

        .sample-dashboard-more > strong {
          display: block;
          color: #14573e;
          font-size: 13px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .sample-dashboard-more > p {
          margin: 7px 0 0;
          color: #4f6658;
          font-size: 11px;
          line-height: 1.65;
          word-break: keep-all;
        }

        .sample-dashboard-more > span {
          display: block;
          margin-top: 8px;
          color: #647b6b;
          font-size: 10px;
          font-weight: 700;
        }        


        /* 샘플 리포트와 별도 안내를 PC 오른쪽 열에 함께 배치 */
        .sample-report-column {
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          align-self: start;
        }

        .sample-report-column .hero-report.sample-dashboard {
          width: 100%;
          max-width: none;
        }


        /* 샘플 리포트 바깥 — 추가 페이지 안내 배너 */

        .sample-report-column .sample-report-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          margin-top: 14px;
          padding: 17px 18px;
          border: 0;
          border-radius: 10px;
          background: #105b43;
          box-sizing: border-box;
        }

        .sample-report-notice-icon {
          display: grid;
          width: 27px;
          height: 27px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #d9f1e2;
          color: #105b43;
          font-size: 21px;
          font-weight: 800;
          line-height: 1;
        }

        .sample-report-notice-content {
          min-width: 0;
        }

        .sample-report-notice-label {
          display: block;
          color: #c6e7d3;
          font-size: 10px;
          font-weight: 700;
        }

        .sample-report-notice-title {
          display: block;
          margin-top: 5px;
          color: #ffffff;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.45;
          word-break: keep-all;
        }

        .sample-report-notice-content p {
          margin: 9px 0 0;
          color: #e1efe6;
          font-size: 11px;
          line-height: 1.65;
          word-break: keep-all;
        }

        .sample-report-notice-pages {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 9px;
          border-radius: 4px;
          background: #28765a;
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
        }

        @media (max-width: 680px) {
          .hero-report.sample-dashboard {
            padding: 11px;
          }

          .sample-dashboard-topline {
            flex-wrap: wrap;
          }

          .sample-dashboard-hero {
            padding: 13px;
          }

          .hero-report.sample-dashboard .sample-dashboard-hero h2 {
            font-size: 22px;
          }

          .sample-dashboard-price-grid,
          .sample-dashboard-evidence-grid,
          .sample-dashboard-action-grid {
            grid-template-columns: 1fr;
          }

          .sample-dashboard-price-card > strong {
            font-size: 19px;
          }

          .sample-dashboard-section-title > span {
            max-width: 45%;
          }

          .sample-dashboard-footer {
            flex-wrap: wrap;
          }



          .sample-report-notice p > strong {
            color: #2d4939;
            font-weight: 800;
          }

          .sample-report-notice p > span {
            display: block;
            margin-top: 5px;
            color: #7b857d;
            font-size: 10px;
          }
          
        }
      `}</style>
    </main>
  );
}