
"use client";

import { useEffect, useRef } from "react";

const signals = [
  {
    value: "29억 2,000만원",
    label: "최근 실거래",
  },
  {
    value: "34억 4,995만원",
    label: "경쟁 매물 최저가",
  },
  {
    value: "36억원",
    label: "현재 희망가",
  },
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

  const gtag = (window as Window & {
    gtag?: (...args: unknown[]) => void;
  }).gtag;

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
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
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
                <span>이미 매도 중이라면</span>
                <strong>
                  왜 안 팔리는지, 무엇부터 확인해야 할지 알아보세요.
                </strong>
              </div>

              <a
                className="primary-button hero-choice-button"
                href="#diagnosis-product"
                onClick={() => trackGa4Event("diagnosis_cta_click")}
              >
                내 아파트 매도 정체 진단하기
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <p className="hero-trust-note">
            국토교통부 실거래 자동조회 · 단계별 1회 결제
          </p>
        </div>

        <div
          className="hero-report"
          aria-label="리센츠 매도 정체 진단 예시"
        >
          <div className="report-topline">
            <span className="report-label">
              실제 진단에서는 이런 것을 확인합니다
            </span>
            <span className="report-code">SAMPLE REPORT</span>
          </div>

          <p className="report-address">
            서울 송파구 잠실동 · 리센츠 · 전용 84.99㎡
          </p>

          <div className="diagnosis-badge">
            <i />
            매도 중 진단 예시
          </div>

          <h2>
            실거래 대비 높은 희망가로
            <br />
            <em>가격 경쟁력</em>이 낮아졌습니다.
          </h2>

          <p className="report-summary">
            최근 거래는 꾸준하지만 현재 희망가는 최근 실거래와 입력한 경쟁
            매물 최저가보다 높습니다. 가격 차이가 초기 비교 단계에서 부담으로
            작용할 가능성이 큽니다.
          </p>

          <div className="signal-grid">
            {signals.map((signal) => (
              <div className="signal" key={signal.label}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>

          <div className="next-action">
            <span>진단 결과</span>
            <p>현재 가장 큰 병목은 가격 경쟁력입니다.</p>
          </div>

          <div className="next-action">
            <span>다음 행동</span>
            <p>
              입력한 경쟁 매물 최저가와의 가격 차이를 줄일 수 있는지 점검
            </p>
          </div>

          <p className="report-note">
            국토교통부 실거래 자동조회 · 사용자 입력 기반 분석입니다. 거래 성사를
            보장하지 않습니다.
          </p>
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

            <strong>
              매도 중 정체 원인
            </strong>

            <p>
              가격·거래 유동성·노출·문의 전환·현장 조건 중
              가장 가능성이 높은 매도 병목을 구분합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>2</span>

            <strong>
              매도 중 가격 전략
            </strong>

            <p>
              실거래와 경쟁 매물, 문의와 방문 흐름을
              바탕으로 가격 유지·소폭 조정·적극 조정
              시나리오를 비교합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>3</span>

            <strong>
              30일 실행 순서
            </strong>

            <p>
              진단 결과를 기준으로 1주차부터 4주차까지
              확인하고 실행할 행동을 순서대로 정리합니다.
            </p>
          </div>

          <div className="sample-step-card">
            <span>4</span>

            <strong>
              유지·조정 판단 기준
            </strong>

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

        <div className="pricing-cards">
          <div
            ref={diagnosisProductRef}
            className="pricing-card featured"
            id="diagnosis-product"
          >
            <span className="recommended">
              매도 중
            </span>

            <div>
              <p className="plan-name">
                매도 정체 진단
              </p>

              <p className="price">
                <strong>
                  9,900
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
                다음에 확인할 핵심 정보
              </li>

              <li>
                저장·인쇄 가능한 분석 리포트
              </li>
            </ul>

            <a
              className="primary-button dark"
              href="/diagnosis"
              onClick={() => trackGa4Event("diagnosis_product_click")}
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
                <strong>
                  14,500
                </strong>
                원
              </p>

              <p className="price-note">
                기존 매도 진단 결과 한 건 기준
              </p>
            </div>

            <ul>
              <li>
                진단 결과 기반 실행 우선순위
              </li>

              <li>
                1주차부터 4주차까지 실행 계획
              </li>

              <li>
                중개사·노출·가격 점검 행동
              </li>

              <li>
                문의·방문·협상 반응 기록 기준
              </li>

              <li>
                전략 유지·조정 판단 트리거
              </li>

              <li>
                다음 재점검 시점
              </li>

              <li>
                저장·인쇄 가능한 실행전략
              </li>
            </ul>

            <a
              className="primary-button dark"
              href="/execution-strategy"
              onClick={() => trackGa4Event("execution_strategy_product_click")}
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
              <strong>
                매도 정체 진단
              </strong>

              <p>
                이미 매도 중이라면 경쟁 매물과 매수 반응을
                함께 분석해 현재 막힌 지점을 진단합니다.
              </p>
            </div>
          </li>

          <li>
            <span>02</span>

            <div>
              <strong>
                진단 후 실행
              </strong>

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

          <span>
            왜 안 팔릴까?
          </span>
        </a>

        <p>
          매도 정체 원인부터 진단 후 30일 실행까지,
          데이터와 AI로 분석합니다.
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
            <span>
              상호 {businessInfo.businessName}
            </span>

            <span>
              대표자 {businessInfo.representative}
            </span>

            <span>
              사업자등록번호{" "}
              {businessInfo.registrationNumber}
            </span>

            <span>
              사업장 주소 {businessInfo.address}
            </span>

            <span>
              전화번호 {businessInfo.phone}
            </span>

            {businessInfo.mailOrderNumber && (
              <span>
                통신판매업 신고번호{" "}
                {businessInfo.mailOrderNumber}
              </span>
            )}
          </div>
        )}
      </footer>

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        #diagnosis-product {
          scroll-margin-top: 24px;
        }
      `}</style>
    </main>
  );
}