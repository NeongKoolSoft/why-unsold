"use client";

import type { Diagnosis } from "./report-types";

type BasicReportProps = {
  result: Diagnosis;
  onOpenDetail: () => void;
  onEdit: () => void;
};

type IconName =
  | "building"
  | "area"
  | "price"
  | "calendar"
  | "document"
  | "pen"
  | "chart"
  | "tag"
  | "history"
  | "search"
  | "unknown"
  | "database"
  | "balance";

function formatGap(value: number) {
  const rounded = Math.abs(value).toFixed(1);

  if (Math.abs(value) < 0.05) {
    return "거의 같은 수준";
  }

  return value > 0
    ? `${rounded}% 높은 수준`
    : `${rounded}% 낮은 수준`;
}

function ReportIcon({ name }: { name: IconName }) {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "building":
      return (
        <svg {...commonProps}>
          <path d="M4 21V4h10v17" />
          <path d="M14 9h6v12" />
          <path d="M8 8h2M8 12h2M8 16h2M17 13h1M17 17h1" />
          <path d="M2 21h20" />
        </svg>
      );

    case "area":
      return (
        <svg {...commonProps}>
          <path d="M5 4h4M4 5v4M15 4h4M20 5v4M5 20h4M4 15v4M15 20h4M20 15v4" />
        </svg>
      );

    case "price":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 8l2 8 2-8 2 8 2-8" />
          <path d="M7 11h10" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      );

    case "document":
      return (
        <svg {...commonProps}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5M9 12h6M9 16h6" />
        </svg>
      );

    case "pen":
      return (
        <svg {...commonProps}>
          <path d="M4 20l4.5-1 10-10a2 2 0 0 0-3-3l-10 10L4 20z" />
          <path d="M14 7l3 3" />
        </svg>
      );

    case "chart":
      return (
        <svg {...commonProps}>
          <path d="M4 20V10M10 20V5M16 20v-8M22 20H2" />
        </svg>
      );

    case "tag":
      return (
        <svg {...commonProps}>
          <path d="M20 13l-7 7-9-9V4h7z" />
          <circle cx="8.5" cy="8.5" r="1" />
        </svg>
      );

    case "history":
      return (
        <svg {...commonProps}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
          <path d="M8 14h3M8 17h6" />
        </svg>
      );

    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
      );

    case "unknown":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 9h8M8 13h5M8 17h3" />
        </svg>
      );

    case "database":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );

    case "balance":
      return (
        <svg {...commonProps}>
          <path d="M12 3v18M5 6h14" />
          <path d="M5 6l-3 6h6zM19 6l-3 6h6z" />
          <path d="M7 21h10" />
        </svg>
      );

    default:
      return null;
  }
}

export default function BasicReport({
  result,
  onOpenDetail,
  onEdit,
}: BasicReportProps) {
  const { metrics } = result;

  const priceInterpretation =
    metrics.tradeGapPercent < -0.05
      ? `현재 희망가는 최근 동일 면적 실거래보다 ${formatGap(
          metrics.tradeGapPercent
        )}입니다. 최근 실거래만 기준으로 보면 희망가가 명백하게 높은 가격이라고 단정하기는 어렵습니다.`
      : metrics.tradeGapPercent > 0.05
        ? `현재 희망가는 최근 동일 면적 실거래보다 ${formatGap(
            metrics.tradeGapPercent
          )}입니다. 가격 차이가 매수자의 첫 번째 비교 단계에서 부담으로 작용하는지 확인할 필요가 있습니다.`
        : "현재 희망가는 최근 동일 면적 실거래와 거의 같은 수준입니다. 가격 이외의 거래량과 경쟁 매물 조건도 함께 확인해야 합니다.";

  const liquidityInterpretation =
    metrics.complexTransactionCount12m <= 2
      ? `최근 1년 단지 전체 거래가 ${metrics.complexTransactionCount12m}건으로 매우 적습니다. 가격이 적정하더라도 실제 매수자가 나타나는 빈도 자체가 낮을 수 있습니다.`
      : `최근 1년 단지 전체 거래는 ${metrics.complexTransactionCount12m}건입니다. 가격뿐 아니라 같은 면적의 실제 거래 빈도와 경쟁 매물 상황을 함께 확인해야 합니다.`;

  const gapInterpretation =
    metrics.monthsSinceLastTrade >= 24
      ? `동일 면적 거래 공백이 ${metrics.monthsSinceLastTrade}개월입니다. 과거 실거래가 현재 시장의 체결 가능 가격을 그대로 설명하기에는 공백이 긴 편입니다.`
      : `동일 면적 최근 거래 이후 ${metrics.monthsSinceLastTrade}개월이 지났습니다. 최근 실거래와 현재 경쟁 매물을 함께 비교하는 것이 필요합니다.`;

  return (
    <>
      <div className="basic-report">
        {/* =====================================================
            PAGE 1
        ====================================================== */}
        <article className="basic-report-page">
          <header className="report-page-header">
            <div className="report-brand">
              <span className="report-brand-mark">?</span>

              <div>
                <strong>왜 안 팔릴까</strong>
                <span>데이터 기반 아파트 매도 진단</span>
              </div>
            </div>

            <span className="report-page-number">
              BASIC REPORT&nbsp; · &nbsp;1/2
            </span>
          </header>

          <section className="report-title-section">
            <p className="report-eyebrow">
              아파트 매도 정체 진단&nbsp; · &nbsp;BASIC
            </p>

            <h3>{result.apartmentName} 매도 정체 진단</h3>

            <p className="report-title-description">
              시세만으로 설명하기 어려운 현재 매도 상황을 최근 실거래,
              거래 빈도, 희망가격과 공개 시장정보를 기준으로 정리합니다.
            </p>
          </section>

          <dl className="report-info-grid report-info-grid-premium">
            <div>
              <span className="report-info-icon">
                <ReportIcon name="building" />
              </span>

              <div>
                <dt>대상</dt>
                <dd>{result.complex}</dd>
              </div>
            </div>

            <div>
              <span className="report-info-icon">
                <ReportIcon name="area" />
              </span>

              <div>
                <dt>면적</dt>
                <dd>{result.area}</dd>
              </div>
            </div>

            <div>
              <span className="report-info-icon">
                <ReportIcon name="price" />
              </span>

              <div>
                <dt>희망가</dt>
                <dd>{result.askingPrice}</dd>
              </div>
            </div>

            <div>
              <span className="report-info-icon">
                <ReportIcon name="calendar" />
              </span>

              <div>
                <dt>등록 시기</dt>
                <dd>{result.listedAt}</dd>
              </div>
            </div>

            <div>
              <span className="report-info-icon">
                <ReportIcon name="document" />
              </span>

              <div>
                <dt>리포트 번호</dt>
                <dd>{result.reportId}</dd>
              </div>
            </div>

            <div>
              <span className="report-info-icon">
                <ReportIcon name="pen" />
              </span>

              <div>
                <dt>작성일</dt>
                <dd>{result.createdAt}</dd>
              </div>
            </div>
          </dl>

          <section className="report-cause-box report-cause-box-premium">
            <div className="report-cause-content">
              <span className="report-cause-label">
                가장 가능성 높은 원인
              </span>

              <h4>{result.headline}</h4>

              <p>{result.summary}</p>
            </div>

            <div className="report-cause-watermark" aria-hidden="true">
              <ReportIcon name="search" />
            </div>
          </section>

          <div className="report-highlights report-highlights-premium">
            {result.highlights.map((item, index) => (
              <div key={item.label}>
                <span className="report-highlight-icon">
                  <ReportIcon
                    name={
                      index === 0
                        ? "balance"
                        : index === 1
                          ? "chart"
                          : "history"
                    }
                  />
                </span>

                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <footer className="report-page-footer">
            <span>입력 데이터 기반 아파트 매도 정체 진단</span>
            <span>거래 성사를 보장하지 않습니다.</span>
          </footer>
        </article>

        {/* =====================================================
            PAGE 2
        ====================================================== */}
        <article className="basic-report-page">
          <header className="report-page-header">
            <div className="report-page-section-name">
              아파트 매도 정체 진단&nbsp; · &nbsp;BASIC
            </div>

            <span className="report-page-number">
              BASIC REPORT&nbsp; · &nbsp;2/2
            </span>
          </header>

          <section className="report-section report-section-premium">
            <div className="report-section-heading">
              <span className="report-section-number">01</span>

              <div>
                <h4>판단 근거</h4>
                <p>
                  현재 매도 정체의 가능성이 높은 원인을 세 가지 핵심 데이터로
                  정리합니다.
                </p>
              </div>
            </div>

            <div className="evidence-table evidence-table-premium">
              {result.evidence.map((item, index) => (
                <div className="evidence-row" key={item.number}>
                  <div className="evidence-label">
                    <span className="evidence-icon">
                      <ReportIcon
                        name={
                          index === 0
                            ? "chart"
                            : index === 1
                              ? "tag"
                              : "history"
                        }
                      />
                    </span>

                    <span className="evidence-number">{item.number}</span>

                    <strong>{item.label}</strong>
                  </div>

                  <div className="evidence-content">
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section report-section-premium">
            <div className="report-section-heading">
              <span className="report-section-number">02</span>

              <div>
                <h4>현재 상황 해석</h4>
                <p>
                  숫자가 현재 매도 상황에서 어떤 의미를 갖는지 간단히
                  해석합니다.
                </p>
              </div>
            </div>

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-icon">
                    <ReportIcon name="price" />
                  </span>

                  <span className="evidence-number">01</span>
                  <strong>가격 위치</strong>
                </div>

                <div className="evidence-content">
                  <strong>
                    가격만으로 현재 매도 정체를 설명할 수 있는지 확인합니다.
                  </strong>

                  <p>{priceInterpretation}</p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-icon">
                    <ReportIcon name="chart" />
                  </span>

                  <span className="evidence-number">02</span>
                  <strong>거래 빈도</strong>
                </div>

                <div className="evidence-content">
                  <strong>
                    매수자가 실제로 얼마나 자주 나타나는 시장인지 봅니다.
                  </strong>

                  <p>{liquidityInterpretation}</p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-icon">
                    <ReportIcon name="history" />
                  </span>

                  <span className="evidence-number">03</span>
                  <strong>거래 공백</strong>
                </div>

                <div className="evidence-content">
                  <strong>
                    과거 실거래가 현재 시장을 얼마나 설명할 수 있는지 봅니다.
                  </strong>

                  <p>{gapInterpretation}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="report-section report-action-section report-section-premium">
            <div className="report-section-heading">
              <span className="report-section-number">03</span>

              <div>
                <h4>지금 확인할 것 하나</h4>
                <p>
                  가격을 바꾸기 전에 현재 데이터에서 가장 먼저 추가 확인해야
                  할 항목입니다.
                </p>
              </div>
            </div>

            <div className="report-action-box report-action-box-premium">
              <span className="report-action-icon">
                <ReportIcon name="search" />
              </span>

              <div>
                <span className="report-action-label">다음 행동</span>

                <strong>{result.actionTitle}</strong>

                <p>{result.actionDescription}</p>
              </div>
            </div>
          </section>

          <div className="report-limits report-limits-premium">
            <div>
              <span className="report-limit-icon">
                <ReportIcon name="unknown" />
              </span>

              <div>
                <strong>이번 리포트로 알 수 없는 것</strong>

                <p>
                  중개사 노출, 사진, 층·방향, 내부 상태, 실제 방문자 반응과
                  협상 내용 등 현장 정보
                </p>
              </div>
            </div>

            <div>
              <span className="report-limit-icon">
                <ReportIcon name="database" />
              </span>

              <div>
                <strong>데이터 기준</strong>

                <p>
                  {result.dataDate}&nbsp; | &nbsp;국토교통부 실거래 자동조회 ·
                  사용자 입력 단지 · 공개 매물 정보
                </p>
              </div>
            </div>
          </div>

          <aside className="report-disclaimer">
            <span className="report-disclaimer-mark">i</span>

            <div>
              <strong>리포트 한계 안내</strong>

              <p>
                본 리포트는 입력 데이터와 공개된 시장정보를 이용해 현재 매도
                상황을 정리한 참고용 진단입니다. 특정 가격에서의 거래 가능성이나
                매도 시점을 확정적으로 예측하지 않습니다.
              </p>
            </div>
          </aside>

          <footer className="report-page-footer">
            <span>입력 데이터 기반 아파트 매도 정체 진단</span>
            <span>거래 성사를 보장하지 않습니다.</span>
          </footer>
        </article>
      </div>

      <div className="report-controls">
        <button type="button" onClick={() => window.print()}>
          리포트 저장·인쇄
        </button>

        <button type="button" onClick={onOpenDetail}>
          상세 리포트 보기
        </button>

        <button type="button" className="ghost" onClick={onEdit}>
          입력값 수정
        </button>
      </div>
    </>
  );
}