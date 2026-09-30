
"use client";

import { useEffect, useRef, useState } from "react";

const samplePrices = {
  pricePosition: "실거래 대비 -4.8%",
  listedDays: "등록 후 42일",
  marketLiquidity: "거래가 드문 편",
};

const sampleEvidence = [
  {
    label: "가격 위치",
    title: "최근 실거래보다 낮은 가격입니다.",
    description:
      "예시 희망가격은 최근 비교 실거래보다 약 4.8% 낮습니다. 현재 반응 부족을 가격만으로 설명하기는 어렵습니다.",
  },
  {
    label: "매도 기간",
    title: "등록 후 42일이 지났습니다.",
    description:
      "초기 반응을 지켜보는 단계를 지나 현재 매물 조건과 노출 상태를 함께 점검할 시점입니다.",
  },
  {
    label: "시장 유동성",
    title: "동일 면적 거래가 드문 편입니다.",
    description:
      "거래 공백이 길면 가격만으로 반응 부족 원인을 판단하기 어렵습니다.",
  },
];

const sampleCauses = [
  {
    label: "먼저 점검",
    title: "매물 노출 상태",
    description:
      "중개업소와 매물 플랫폼에서 가격·사진·설명·노출 상태가 제대로 전달되고 있는지 확인합니다.",
  },
  {
    label: "함께 확인",
    title: "매물 조건",
    description:
      "층·방향·수리 상태·입주 가능일 등 가격 외 조건이 매수 반응에 영향을 주는지 살펴봅니다.",
  },
  {
    label: "다음 판단",
    title: "문의·방문 반응",
    description:
      "조건을 점검한 뒤 문의와 방문 반응이 달라지는지 확인해 다음 가격 판단에 활용합니다.",
  },
];

const sampleActions = [
  "매물 노출 상태와 안내 내용 점검",
  "층·방향·수리 상태·입주 조건 다시 확인",
  "점검 후 문의·방문 반응 다시 확인",
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
  const [showSampleDetails, setShowSampleDetails] = useState(false);

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
          <span>내 집 매도</span>
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
          제공 내용
        </a>
      </nav>

      <section
        className="hero"
        id="top"
      >
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            아파트 매도 판단
          </p>

          <h1>
            내 아파트,
            <br />
            <strong>지금 가격을 유지해도 될까?</strong>
          </h1>

          <p className="hero-description">
            최근 실거래와 현재 희망가격을 먼저 비교해보세요.
            <br className="mobile-break" />
            매도 중이라면 문의·방문 반응까지 함께 보고
            가격을 유지할지, 조정할지, 더 기다릴지 확인할 수 있습니다.
          </p>     

          <div
            className="hero-flow"
            aria-label="추천 이용 순서"
          >
            <div className="hero-flow-heading">
              <span>추천 순서</span>
              <strong>
                가격 위치를 확인한 뒤 현재 매도 판단까지 이어서 확인해보세요.
              </strong>
            </div>

            <div className="hero-flow-list">
              <a
                className="hero-flow-card hero-flow-card-primary"
                href="/free-price-check"
                onClick={() =>
                  trackGa4Event("free_price_check_cta_click")
                }
              >
                <span className="hero-flow-number">1</span>

                <div className="hero-flow-copy">
                  <span>무료 가격 확인</span>
                  <strong>
                    현재 희망가격 위치 확인하기
                  </strong>
                  <small>
                    최근 동일 면적 실거래와 현재 희망가격의 차이를 확인합니다.
                  </small>
                </div>

                <span
                  className="hero-flow-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>

              <a
                className="hero-flow-card hero-flow-card-secondary"
                href="#diagnosis-product"
                onClick={() =>
                  trackGa4Event("decision_home_cta_click")
                }
              >
                <span className="hero-flow-number">2</span>

                <div className="hero-flow-copy">
                  <span>매도 중이라면</span>
                  <strong>
                    지금 가격을 유지할지 조정할지 확인하기
                  </strong>
                  <small>
                    매도 기간과 문의·방문 반응을 함께 살펴
                    현재 우선 검토할 방향을 확인합니다.
                  </small>
                </div>

                <span
                  className="hero-flow-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* =====================================================
            리센츠 샘플 리포트 — 대시보드형
            설명용 예시이며 현재 시세를 뜻하지 않습니다.
        ====================================================== */}
        <div className="sample-report-column">
          <div
            className="hero-report sample-dashboard"
            aria-label="현재 매도 판단 예시"
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
                    현재 판단에서는 이런 정보를 함께 봅니다
                  </strong>
                  <p>
                    설명용 매도 상황 예시 · 실제 매물 결과가 아닙니다
                  </p>
                </div>
              </div>

              <span className="sample-dashboard-code">
                DECISION EXAMPLE
              </span>
            </div>

            <div className="sample-dashboard-hero">
              <span className="sample-dashboard-badge">
                현재 매도 판단 예시
              </span>

              <h2>
                가격보다 다른 조건을 먼저
                <br />
                <em>점검할 단계입니다.</em>
              </h2>

              <p className="sample-dashboard-summary">
                예시 희망가격은 최근 실거래보다 낮지만,
                등록 후 42일 동안 문의 1회, 방문 0회입니다.
                거래가 드문 시장에서는 가격만으로 반응 부족 원인을
                판단하기 어려워 다른 조건을 함께 확인할 필요가 있습니다.
              </p>

              <div className="sample-dashboard-reason">
                <strong>현재 우선 검토할 방향</strong>
                <span>가격 조정보다 다른 조건 먼저 점검</span>
              </div>
            </div>

            <div className="sample-dashboard-price-grid">
              <div className="sample-dashboard-price-card sample-dashboard-trade">
                <span>▥ 가격 위치</span>
                <strong>{samplePrices.pricePosition}</strong>
                <p>최근 비교 실거래 기준</p>
              </div>

              <div className="sample-dashboard-price-card sample-dashboard-listing">
                <span>◇ 매도 기간</span>
                <strong>{samplePrices.listedDays}</strong>
                <p>매물 등록 후 경과 기간</p>
              </div>

              <div className="sample-dashboard-price-card sample-dashboard-asking">
                <span>◎ 시장 유동성</span>
                <strong>{samplePrices.marketLiquidity}</strong>
                <p>동일 면적 거래 흐름 기준</p>
              </div>
            </div>

            <button
              type="button"
              className="sample-dashboard-toggle"
              aria-expanded={showSampleDetails}
              onClick={() => {
                setShowSampleDetails((prev) => !prev);

                if (!showSampleDetails) {
                  trackGa4Event("sample_report_expand");
                }
              }}
            >
              {showSampleDetails
                ? "판단 근거와 지금 할 일 접기 ↑"
                : "판단 근거와 지금 할 일 보기 ↓"}
            </button>

            {showSampleDetails && (
              <div className="sample-dashboard-details">
                <section className="sample-dashboard-panel">
                  <div className="sample-dashboard-section-title">
                    <strong>▥ 핵심 근거 3가지</strong>
                    <span>
                      현재 판단에 사용한 정보를 구분합니다.
                    </span>
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
                    <strong>◎ 함께 점검할 조건</strong>
                    <span>
                      가격 외에 확인할 조건을 구분합니다.
                    </span>
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
                    <span>
                      다음 판단을 위해 먼저 확인할 행동입니다.
                    </span>
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
                  설명용 입력값으로 만든 판단 예시 · 현재 시세 또는
                  실제 매물 진단 결과가 아닙니다.
                </p>

                <div className="sample-dashboard-footer">
                  <span>데이터 기반 매도 판단</span>
                  <span>거래 성사를 보장하지 않습니다.</span>
                </div>
              </div>
            )}
          </div>

          <div className="sample-report-notice">
            <span
              className="sample-report-notice-icon"
              aria-hidden="true"
            >
              +
            </span>

            <div className="sample-report-notice-content">
              <span className="sample-report-notice-label">
                다음 단계
              </span>

              <strong className="sample-report-notice-title">
                무료 판단 후 필요하면 상세 분석으로 이어갈 수 있습니다.
              </strong>

              <p>
                현재 판단에서 가격만으로 설명하기 어려운 경우,
                매도 정체 원인과 가격 시나리오, 병목 분석,
                실행 방향을 더 자세히 확인할 수 있습니다.
              </p>

              <span className="sample-report-notice-pages">
                무료 판단 → 필요 시 상세 분석
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
            가격 위치부터 현재 판단,
            <br />
            필요하면 상세 분석까지 이어집니다.
          </h2>
        </div>

        <div className="sample-steps">
          <div className="sample-step-card">
            <span>1</span>

            <strong>가격 위치 확인</strong>

            <p>
              최근 동일 면적 실거래와 현재 희망가격을 비교해
              내 가격이 어느 위치에 있는지 먼저 확인합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>2</span>

            <strong>현재 매도 판단</strong>

            <p>
              매도 기간과 문의·방문 반응을 함께 보고
              가격 유지·조정·대기 중 현재 우선 검토할 방향을 확인합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>3</span>

            <strong>필요하면 상세 진단</strong>

            <p>
              가격만으로 설명하기 어려운 경우
              정체 원인과 병목, 가격 시나리오를 더 자세히 분석합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>4</span>

            <strong>30일 실행전략</strong>

            <p>
              상세 진단 결과를 바탕으로
              실행 순서와 다음 재점검 기준을 정리합니다.
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
            판단과 상세 분석을 선택하세요.
          </h2>
        </div>

        <div className="pricing-cards">

          <div className="pricing-card">
            <span className="recommended">
              1단계 · 무료
            </span>

            <div>
              <p className="plan-name">
                무료 매도 판단
              </p>

              <p className="price">
                <strong>0</strong>원
              </p>

              <p className="price-note">
                가격 확인부터 현재 판단까지
              </p>
            </div>

            <ul>
              <li>최근 동일 면적 실거래 확인</li>
              <li>현재 희망가격 위치 확인</li>
              <li>매도 기간·문의·방문 반응 확인</li>
              <li>현재 유지·조정·대기 판단</li>
              <li>핵심 판단 근거 3가지</li>
              <li>지금 할 일 확인</li>
            </ul>

            <a
              className="primary-button dark"
              href="/free-price-check"
              onClick={() =>
                trackGa4Event("free_price_check_product_click")
              }
            >
              무료로 현재 판단 확인하기
            </a>
          </div>

          <div
            ref={diagnosisProductRef}
            className="pricing-card featured"
            id="diagnosis-product"
          >
            <span className="recommended">
              2단계 · 진단
            </span>

            <div>
              <p className="plan-name">
                상세 정체 진단
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
              상세 정체 진단 시작하기
            </a>
          </div>

          <div
            className="pricing-card"
            ref={executionStrategyProductRef}
          >
            <span className="recommended">
              3단계 · 진단 후 실행
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
                실거래와 경쟁 매물, 매수 반응을 함께 분석해 현재 막힌 지점을 진단합니다.
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

          <span>내 집 매도</span>
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

        .sample-dashboard-toggle {
          width: 100%;
          margin-top: 18px;
          padding: 11px 14px;
          border: 0;
          border-top: 1px solid #d9e5db;
          border-radius: 0;
          background: transparent;
          color: #176247;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .sample-dashboard-details {
          margin-top: 4px;
        }

      `}</style>
    </main>
  );
}