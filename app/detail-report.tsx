
"use client";

import type { Diagnosis } from "./report-types";
import StrategyEntryCard from "./execution-strategy/strategy-entry-card";

type DetailReportProps = {
  result: Diagnosis;
  onBack?: () => void;
  onEdit: () => void;
};

type IconName =
  | "building"
  | "area"
  | "price"
  | "calendar"
  | "document"
  | "clock"
  | "trend"
  | "history"
  | "chat"
  | "person"
  | "handshake"
  | "balance"
  | "database"
  | "search"
  | "target"
  | "check"
  | "warning";

function formatWon(value: number) {
  if (value >= 10000) {
    const eok = Math.floor(value / 10000);
    const remainder = value % 10000;
    return remainder === 0
      ? `${eok}억원`
      : `${eok}억 ${remainder.toLocaleString("ko-KR")}만원`;
  }
  return `${value.toLocaleString("ko-KR")}만원`;
}

function formatGap(value: number) {
  const rounded = Math.abs(value).toFixed(1);
  if (Math.abs(value) < 0.05) return "차이 없음";
  return value > 0 ? `${rounded}% 높음` : `${rounded}% 낮음`;
}

function firstText(values: string[] | undefined, fallback: string) {
  return values?.[0]?.trim() || fallback;
}

function secondText(values: string[] | undefined, fallback: string) {
  return values?.[1]?.trim() || fallback;
}

function causeStrategy(result: Diagnosis) {
  const strategies = {
    price: {
      title: "가격 경쟁력을 먼저 확인해야 합니다.",
      description:
        "현재 희망가와 최근 실거래·경쟁 매물의 차이를 함께 보고 실제 매수자의 반응 변화를 확인해야 합니다.",
      bottleneck: "가격 저항",
      bottleneckDescription:
        "현재 매도 정체에서 가격 경쟁력 문제가 상대적으로 강하게 나타날 가능성이 있습니다. 실거래와 경쟁 매물의 가격 범위를 함께 확인해야 합니다.",
      finalSummary:
        "가격을 무조건 낮추기보다 경쟁 매물과 실제 매수 반응을 기준으로 조정 여부를 판단하는 것이 우선입니다.",
    },
    liquidity: {
      title: "가격보다 거래 유동성을 먼저 봐야 합니다.",
      description:
        "거래 자체가 드문 시장에서는 가격을 내려도 즉시 거래되지 않을 수 있습니다. 매도 기한과 실제 거래 빈도를 함께 봐야 합니다.",
      bottleneck: "시장 유동성 부족",
      bottleneckDescription:
        "현재 매도 정체는 가격 하나보다 실제 매수자와 거래 자체가 드문 시장 구조에서 발생했을 가능성이 있습니다.",
      finalSummary:
        "현재 시장에서는 가격만 조정하기보다 기다릴 수 있는 기간을 정하고 실제 반응에 따라 전략을 바꾸는 것이 중요합니다.",
    },
    exposure: {
      title: "가격보다 매물 노출 상태를 먼저 확인해야 합니다.",
      description:
        "중개업소 수, 사진과 설명, 포털 노출 상태를 확인한 뒤 문의량이 달라지는지 살펴봐야 합니다.",
      bottleneck: "매물 노출 부족",
      bottleneckDescription:
        "가격이 시장 범위에서 크게 벗어나지 않았는데 문의가 부족하다면 매수자가 매물을 발견하거나 선택하는 단계의 문제일 가능성이 있습니다.",
      finalSummary:
        "가격 변경보다 매물 노출과 정보 품질을 먼저 점검하고 이후 문의량 변화를 확인하는 것이 우선입니다.",
    },
    conversion: {
      title: "문의가 방문으로 이어지지 않는 이유를 확인해야 합니다.",
      description:
        "문의 단계에서 반복되는 질문과 방문으로 이어지지 않은 이유를 기록해 전환을 막는 조건을 찾아야 합니다.",
      bottleneck: "문의 → 방문 전환",
      bottleneckDescription:
        "문의는 있지만 실제 방문으로 이어지지 않는다면 정보 전달이나 일정·입주 조건 등 방문 전 단계에서 이탈이 발생하고 있을 가능성이 있습니다.",
      finalSummary:
        "가격을 조정하기 전에 문의자가 방문하지 않은 이유를 수집하고 반복되는 이탈 요인을 확인하는 것이 중요합니다.",
    },
    condition: {
      title: "방문 이후의 거절 이유를 확인해야 합니다.",
      description:
        "층·방향·수리 상태·입주 가능일처럼 방문자가 실제로 망설인 조건을 확인한 뒤 가격 조정 여부를 판단해야 합니다.",
      bottleneck: "현장 조건",
      bottleneckDescription:
        "방문까지 이어졌는데도 제안이나 협상으로 연결되지 않는다면 가격 외 현장 조건이 의사결정에 영향을 주고 있을 가능성이 있습니다.",
      finalSummary:
        "방문 이후 반복적으로 거론되는 조건을 수집하고 그 조건을 가격이나 다른 방식으로 보완해야 하는지 판단해야 합니다.",
    },
  } as const;

  return strategies[result.cause];
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
    case "clock":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "trend":
      return (
        <svg {...commonProps}>
          <path d="M4 6l5 5 4-4 7 7" />
          <path d="M15 14h5v-5" />
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
    case "chat":
      return (
        <svg {...commonProps}>
          <path d="M5 18l-2 3v-5a8 8 0 1 1 3 2" />
          <path d="M8 11h.01M12 11h.01M16 11h.01" />
        </svg>
      );
    case "person":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1-5 4-7 8-7s7 2 8 7" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...commonProps}>
          <path d="M8 11l3-3c1-1 2-1 3 0l2 2" />
          <path d="M4 10l4 4M20 10l-4 4" />
          <path d="M7 15l2 2 2-2 2 2 2-2 2 1" />
          <path d="M2 8l3-3 4 4M22 8l-3-3-4 4" />
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
    case "database":
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
      );
    case "target":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case "check":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      );
    case "warning":
      return (
        <svg {...commonProps}>
          <path d="M12 3l9 17H3z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    default:
      return null;
  }
}

function PageFooter() {
  return (
    <footer className="report-page-footer">
      <span>데이터 + AI 기반 매도 분석</span>
      <span>거래 성사를 보장하지 않습니다.</span>
    </footer>
  );
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="report-section-heading">
      <span className="report-section-number">{number}</span>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

function InnerPageHeader() {
  return (
    <header className="report-page-header">
      <div className="report-page-section-name">
        아파트 매도 분석 리포트
      </div>
      <span className="report-page-number">
        ANALYSIS REPORT
      </span>
    </header>
  );
}

export default function DetailReport({
  result,
  onEdit,
}: DetailReportProps) {
  const { metrics } = result;
  const ai = result.aiDetailAnalysis;
  const strategy = causeStrategy(result);

  const inquiryText =
    metrics.inquiries === null ? "미입력" : `${metrics.inquiries}회`;
  const visitText =
    metrics.visits === null ? "미입력" : `${metrics.visits}회`;
  const offerText =
    metrics.offers === null ? "미입력" : `${metrics.offers}회`;

  const executiveHeadline =
    ai?.executiveDiagnosis.headline || strategy.title;
  const executiveSummary =
    ai?.executiveDiagnosis.summary || strategy.description;
  const executiveReason =
    ai?.executiveDiagnosis.keyReason || result.label;

  const priceAnalysisTitle =
    ai?.priceAnalysis.title ||
    "최근 실거래 하나만으로 가격을 판단하기 어렵습니다.";
  const priceAnalysisText = firstText(
    ai?.priceAnalysis.details,
    result.evidence[1]?.description ||
      "최근 실거래와 경쟁 매물 가격을 함께 비교해야 합니다."
  );
  const priceAnalysisText2 = secondText(
    ai?.priceAnalysis.details,
    ai?.priceAnalysis.summary ||
      "가격 위치는 거래량과 실제 매수 반응을 함께 봐야 합니다."
  );

  const liquidityAnalysisTitle =
    ai?.liquidityAnalysis.title ||
    "거래량과 거래 공백을 함께 봐야 합니다.";
  const liquidityAnalysisText = firstText(
    ai?.liquidityAnalysis.details,
    result.evidence[0]?.description ||
      "현재 단지의 실제 거래 빈도를 확인해야 합니다."
  );
  const liquidityAnalysisText2 = secondText(
    ai?.liquidityAnalysis.details,
    ai?.liquidityAnalysis.summary ||
      "거래가 드문 시장에서는 가격 조정만으로 거래가 빨라진다고 단정하기 어렵습니다."
  );

  const marketAnalysisTitle =
    ai?.marketInterpretation.title ||
    "현재 시장의 선택 경쟁을 함께 봐야 합니다.";
  const marketAnalysisText = firstText(
    ai?.marketInterpretation.details,
    result.evidence[2]?.description ||
      "현재 경쟁 매물과 실제 매수 반응을 함께 확인해야 합니다."
  );
  const marketAnalysisText2 = secondText(
    ai?.marketInterpretation.details,
    ai?.marketInterpretation.summary ||
      "경쟁 매물의 호가는 실거래가와 다른 성격의 데이터입니다."
  );

  const bottleneckLabel =
    ai?.bottleneckAnalysis.label || strategy.bottleneck;
  const bottleneckReason =
    ai?.bottleneckAnalysis.reason ||
    strategy.bottleneckDescription;

  const supportingSignal1 = firstText(
    ai?.bottleneckAnalysis.supportingSignals,
    result.evidence[0]?.description ||
      "거래량을 추가로 확인해야 합니다."
  );
  const supportingSignal2 = secondText(
    ai?.bottleneckAnalysis.supportingSignals,
    result.evidence[1]?.description ||
      "현재 가격 위치를 함께 확인해야 합니다."
  );

  const uncertainty1 = firstText(
    ai?.bottleneckAnalysis.uncertainties,
    "현재 데이터만으로 매물 노출 상태는 확인할 수 없습니다."
  );
  const uncertainty2 = secondText(
    ai?.bottleneckAnalysis.uncertainties,
    "실제 매수자의 거절 이유는 추가 확인이 필요합니다."
  );

  const fallbackScenarios = [
    {
      type: "maintain" as const,
      label: "가격 유지",
      description:
        "현재 가격을 유지하며 실제 시장 반응을 더 확인하는 전략입니다.",
      suitableWhen: [
        "가격보다 낮은 거래량이 더 큰 원인으로 보이는 경우",
      ],
      risks: ["반응이 계속 없으면 매도 기간이 길어질 수 있습니다."],
      checkpoints: ["문의와 방문 변화가 나타나는지 확인합니다."],
    },
    {
      type: "adjust_small" as const,
      label: "소폭 조정",
      description:
        "경쟁 매물과 비교했을 때 선택 순위를 개선하는 전략입니다.",
      suitableWhen: ["경쟁 매물 대비 가격 저항이 확인되는 경우"],
      risks: [
        "유동성이 낮으면 가격 조정만으로 거래되지 않을 수 있습니다.",
      ],
      checkpoints: ["조정 뒤 문의와 방문이 증가하는지 확인합니다."],
    },
    {
      type: "adjust_active" as const,
      label: "적극 조정",
      description:
        "매도 기한을 우선하는 경우 고려하는 전략입니다.",
      suitableWhen: [
        "빠른 매도가 필요하고 장기간 반응이 없는 경우",
      ],
      risks: ["필요 이상으로 가격을 낮출 가능성이 있습니다."],
      checkpoints: ["매도 기한과 실제 반응을 함께 확인합니다."],
    },
  ];

  const scenarios =
    ai?.priceScenarios?.length === 3
      ? ai.priceScenarios
      : fallbackScenarios;

  const fallbackPlan = [
    {
      period: "1-7" as const,
      title: "경쟁 조건 확인",
      actions: [
        "같은 면적의 실제 경쟁 매물 가격과 주요 조건을 정리합니다.",
      ],
      decisionCriteria: [
        "현재 매물이 실제 비교군에서 어느 위치인지 확인합니다.",
      ],
    },
    {
      period: "8-14" as const,
      title: "문의 흐름 기록",
      actions: [
        "문의와 방문 횟수, 반복 질문과 거절 이유를 기록합니다.",
      ],
      decisionCriteria: [
        "매수자가 어느 단계에서 이탈하는지 확인합니다.",
      ],
    },
    {
      period: "15-30" as const,
      title: "전략 유지 또는 조정",
      actions: [
        "누적된 반응과 경쟁 매물 조건을 다시 비교합니다.",
      ],
      decisionCriteria: [
        "매도 기한을 기준으로 가격 유지 또는 조정을 판단합니다.",
      ],
    },
  ];

  const actionPlan =
    ai?.actionPlan30Days?.length === 3
      ? ai.actionPlan30Days
      : fallbackPlan;

  const fallbackTriggers = [
    {
      type: "maintain" as const,
      title: "유지 신호",
      condition: "문의 또는 방문이 증가하기 시작한 경우",
      action:
        "가격을 바로 낮추지 말고 협상 단계까지 이어지는지 관찰합니다.",
    },
    {
      type: "adjust" as const,
      title: "조정 신호",
      condition:
        "노출을 점검했는데도 문의와 방문이 계속 없는 경우",
      action:
        "경쟁 매물과 다시 비교해 가격 또는 노출 조건을 조정합니다.",
    },
    {
      type: "reassess" as const,
      title: "재진단 신호",
      condition: "방문은 있지만 제안이 반복적으로 없는 경우",
      action:
        "현장 조건과 체감 가격을 중심으로 원인을 다시 판단합니다.",
    },
  ];

  const triggers =
    ai?.decisionTriggers?.length === 3
      ? ai.decisionTriggers
      : fallbackTriggers;

  const finalHeadline =
    ai?.finalStrategy.headline || strategy.finalSummary;
  const finalSummary =
    ai?.finalStrategy.summary ||
    "현재 데이터에서 확인되는 병목을 먼저 점검하고 실제 매수 반응이 달라질 때 전략을 변경하는 방식이 적절합니다.";

  const priorities =
    ai?.finalStrategy.priorities?.length
      ? ai.finalStrategy.priorities
      : [
          result.actionTitle,
          "실제 문의와 방문 반응 기록",
          "매도 기한에 따른 전략 재검토",
        ];

  const limitations =
    ai?.limitations?.length
      ? ai.limitations.slice(0, 2)
      : [
          "실거래와 사용자 입력 데이터만으로 적정 매도가를 확정할 수 없습니다.",
          "매물 노출 상태와 실제 매수자의 판단 이유는 별도 확인이 필요합니다.",
        ];

  // 산출되지 않은 원인 확률은 사용하지 않습니다.
  const causeSignals = [
    {
      label: "주요 정체 요인",
      title: bottleneckLabel,
      description: bottleneckReason,
    },
    {
      label: "함께 볼 신호",
      title: "추가 판단 근거",
      description: supportingSignal2,
    },
    {
      label: "추가 확인 필요",
      title: "아직 확인하지 못한 정보",
      description: uncertainty1,
    },
  ];

  const firstPageActions = [
    priorities[0] || result.actionTitle,
    priorities[1] || "실제 문의와 방문 반응 기록",
    priorities[2] || "매도 기한에 따른 전략 재검토",
  ];

  function closeReport() {
    const confirmed = window.confirm(
      "리포트를 저장하셨나요?\n\n" +
        "이 화면을 종료하면 현재 리포트를 다시 확인하기 어려울 수 있습니다.\n" +
        "아직 저장하지 않았다면 취소를 누르고 먼저 저장해주세요."
    );

    if (confirmed) onEdit();
  }

  return (
    <>
      <div className="detail-report">
        {/* =====================================================
            PAGE 1 — DASHBOARD
        ====================================================== */}
        <article className="detail-report-page report-dashboard-page">
          <header className="report-page-header">
            <div className="report-brand">
              <span className="report-brand-mark">?</span>
              <div>
                <strong>왜 안 팔릴까</strong>
                <span>데이터 기반 아파트 매도 분석</span>
              </div>
            </div>
            <span className="report-page-number">
              ANALYSIS REPORT
            </span>
          </header>

          <div className="dashboard-content">
            <section className="dashboard-hero">
              <div className="dashboard-hero-top">
                <span className="dashboard-hero-icon">
                  <ReportIcon name="building" />
                </span>
                <div>
                  <strong>실제 진단에서 이런 점을 확인합니다</strong>
                  <p>
                    {result.apartmentName} · {result.area} · 희망가{" "}
                    {result.askingPrice}
                  </p>
                </div>
              </div>

              <span className="dashboard-hero-badge">
                매도 정체 진단 결과
              </span>
              <h3>{executiveHeadline}</h3>
              <p className="dashboard-hero-description">
                {executiveSummary}
              </p>
              <p className="dashboard-hero-reason">
                <strong>현재 가장 가능성 높은 요인</strong>
                <span>{executiveReason}</span>
              </p>
            </section>

            <section className="dashboard-price-grid">
              <div className="dashboard-price-card dashboard-price-trade">
                <span className="dashboard-price-label">
                  <ReportIcon name="building" />
                  최근 실거래
                </span>
                <strong>
                  {formatWon(metrics.latestTradePrice)}
                </strong>
                <p>동일 면적 최근 거래 기준</p>
              </div>

              <div className="dashboard-price-card dashboard-price-listing">
                <span className="dashboard-price-label">
                  <ReportIcon name="price" />
                  경쟁 매물 최저가
                </span>
                <strong>
                  {formatWon(metrics.lowestListingPrice)}
                </strong>
                <p>입력한 경쟁 매물 기준</p>
              </div>

              <div className="dashboard-price-card dashboard-price-asking">
                <span className="dashboard-price-label">
                  <ReportIcon name="target" />
                  현재 희망가
                </span>
                <strong>{formatWon(metrics.askingPrice)}</strong>
                <p>
                  최근 실거래 대비{" "}
                  {formatGap(metrics.tradeGapPercent)}
                </p>
              </div>
            </section>

            <section className="dashboard-panel dashboard-evidence-panel">
              <div className="dashboard-section-heading">
                <span className="dashboard-section-kicker">
                  <ReportIcon name="trend" />
                  핵심 근거 3가지
                </span>
                <p>데이터로 확인한 판단 근거입니다.</p>
              </div>

              <div className="dashboard-evidence-grid">
                {result.evidence.slice(0, 3).map((item, index) => (
                  <div
                    className="dashboard-evidence-card"
                    key={`${item.number}-${index}`}
                  >
                    <div className="dashboard-evidence-title">
                      <span>{index + 1}</span>
                      <strong>{item.label}</strong>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel dashboard-cause-panel">
              <div className="dashboard-section-heading">
                <span className="dashboard-section-kicker">
                  <ReportIcon name="target" />
                  원인 분석
                </span>
                <p>확인된 신호와 추가 확인 사항을 구분합니다.</p>
              </div>

              <div className="dashboard-cause-list">
                {causeSignals.map((signal, index) => (
                  <div
                    className="dashboard-cause-row"
                    key={signal.label}
                  >
                    <span className="dashboard-cause-index">
                      {index + 1}
                    </span>
                    <div className="dashboard-cause-body">
                      <div className="dashboard-cause-top">
                        <strong>{signal.label}</strong>
                        <span>{signal.title}</span>
                      </div>
                      <p>{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel dashboard-action-panel">
              <div className="dashboard-section-heading">
                <span className="dashboard-section-kicker">
                  <ReportIcon name="document" />
                  지금 할 일
                </span>
                <p>다음 결정을 위해 먼저 확인할 행동입니다.</p>
              </div>

              <div className="dashboard-action-grid">
                {firstPageActions.map((action, index) => (
                  <div
                    className="dashboard-action-card"
                    key={`${index}-${action}`}
                  >
                    <span className="dashboard-action-number">
                      {index + 1}
                    </span>
                    <strong>{action}</strong>
                  </div>
                ))}
              </div>
            </section>

            <p className="dashboard-meta">
              {result.complex} · 등록 {metrics.listedDays}일 ·{" "}
              {result.createdAt} · {result.reportId}
            </p>
          </div>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 2 — 판단 근거의 의미와 확인 사항
            첫 페이지의 evidence 문구를 반복하지 않습니다.
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="01"
              title="진단 근거를 읽는 방법"
              description="첫 페이지의 핵심 수치를 매도 판단에 어떻게 활용할지 정리합니다."
            />

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">01</span>
                  <strong>거래 빈도</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    최근 1년 단지 전체{" "}
                    {metrics.complexTransactionCount12m}건 · 동일 면적{" "}
                    {metrics.sameAreaTransactionCount12m}건
                  </strong>
                  <p>
                    단지 전체 거래량과 해당 면적 거래량을 나누어
                    봐야 합니다. 단지에서 거래가 발생했더라도
                    내가 매도하는 면적의 거래가격이 최근에
                    확인된 것은 아닐 수 있습니다.
                  </p>
                  <p>
                    거래량만으로 현재 문의가 없는 이유를 확정할
                    수는 없습니다. 실제 문의와 방문 기록을 함께
                    확인해야 합니다.
                  </p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">02</span>
                  <strong>가격 비교</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    실거래 대비 {formatGap(metrics.tradeGapPercent)} ·
                    경쟁 매물 대비{" "}
                    {formatGap(metrics.listingGapPercent)}
                  </strong>
                  <p>
                    실거래가는 과거에 계약된 가격이고 경쟁 매물
                    최저가는 현재 등록된 호가입니다. 성격이 다른
                    두 숫자를 적정 매도가의 확정 근거로
                    사용해서는 안 됩니다.
                  </p>
                  <p>
                    경쟁 매물과 비교할 때는 가격 외에도 면적,
                    층, 방향, 수리 상태와 입주 조건이 비슷한지
                    확인해야 합니다.
                  </p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">03</span>
                  <strong>거래 공백</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    동일 면적 마지막 거래 이후{" "}
                    {metrics.monthsSinceLastTrade}개월
                  </strong>
                  <p>
                    마지막 거래 이후 기간이 길수록 당시의
                    계약가격이 현재 매수자의 가격 판단을
                    그대로 보여준다고 보기 어렵습니다.
                  </p>
                  <p>
                    최근 비교 거래가 부족한 경우에는 경쟁 매물의
                    실제 등록 상태와 중개업소에서 확인한
                    매수 반응을 함께 기록하는 것이 중요합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="01-A"
              title="현재 데이터로 확인되지 않은 것"
              description="거래 기록과 실제 매수 반응을 구분하여 해석합니다."
            />

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <strong>매수 반응</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    문의 {inquiryText} · 방문 {visitText} · 협상{" "}
                    {offerText}
                  </strong>
                  <p>
                    ‘미입력’은 0회라는 뜻이 아닙니다.
                    중개업소에서 확인한 실제 횟수를 기록해야
                    노출·문의·방문·협상 중 어느 단계에서 반응이
                    줄어드는지 구분할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <strong>추가 확인</strong>
                </div>
                <div className="evidence-content">
                  <strong>현재 분석의 확인 과제</strong>
                  <p>{uncertainty1}</p>
                  <p>{uncertainty2}</p>
                </div>
              </div>
            </div>
          </section>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 3 — 가격 위치와 시장 해석
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="02"
              title="가격 위치"
              description="현재 희망가를 최근 실거래와 경쟁 매물의 가격 사이에서 비교합니다."
            />

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">01</span>
                  <strong>최근 실거래</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    {formatWon(metrics.latestTradePrice)}
                  </strong>
                  <p>
                    현재 희망가는 최근 동일 면적 실거래보다{" "}
                    {formatGap(metrics.tradeGapPercent)}입니다.
                  </p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">02</span>
                  <strong>경쟁 매물</strong>
                </div>
                <div className="evidence-content">
                  <strong>
                    {formatWon(metrics.lowestListingPrice)}
                  </strong>
                  <p>
                    현재 희망가는 입력한 경쟁 매물 최저가보다{" "}
                    {formatGap(metrics.listingGapPercent)}입니다.
                  </p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">03</span>
                  <strong>현재 희망가</strong>
                </div>
                <div className="evidence-content">
                  <strong>{formatWon(metrics.askingPrice)}</strong>
                  <p>
                    가격 위치는 실거래 하나만으로 판단하지 않고
                    거래량과 경쟁 매물도 함께 봐야 합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="03"
              title="가격·시장 해석"
              description="숫자의 단순 비교보다 현재 매도 상황에서 어떤 의미를 갖는지 해석합니다."
            />

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <strong>가격 해석</strong>
                </div>
                <div className="evidence-content">
                  <strong>{priceAnalysisTitle}</strong>
                  <p>{priceAnalysisText}</p>
                  <p>{priceAnalysisText2}</p>
                </div>
              </div>

              <div className="evidence-row">
                <div className="evidence-label">
                  <strong>시장 해석</strong>
                </div>
                <div className="evidence-content">
                  <strong>{marketAnalysisTitle}</strong>
                  <p>{marketAnalysisText}</p>
                  <p>{marketAnalysisText2}</p>
                </div>
              </div>
            </div>
          </section>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 4 — 거래 유동성
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="04"
              title="거래 유동성"
              description="단지 전체와 동일 면적의 거래 빈도 및 거래 공백 기간을 확인합니다."
            />

            <div className="liquidity-grid">
              <div className="liquidity-row">
                <div className="liquidity-label">
                  <span className="liquidity-icon">
                    <ReportIcon name="building" />
                  </span>
                  <div>
                    <span>01</span>
                    <strong>단지 전체</strong>
                  </div>
                </div>
                <div className="liquidity-description">
                  <strong>
                    최근 1년{" "}
                    {metrics.complexTransactionCount12m}건
                  </strong>
                  <p>
                    단지 전체에서 실제 거래가 발생한 빈도입니다.
                  </p>
                </div>
                <div className="liquidity-value">
                  <span>최근 1년</span>
                  <strong>
                    {metrics.complexTransactionCount12m}건
                  </strong>
                </div>
              </div>

              <div className="liquidity-row">
                <div className="liquidity-label">
                  <span className="liquidity-icon">
                    <ReportIcon name="area" />
                  </span>
                  <div>
                    <span>02</span>
                    <strong>동일 면적</strong>
                  </div>
                </div>
                <div className="liquidity-description">
                  <strong>
                    최근 1년{" "}
                    {metrics.sameAreaTransactionCount12m}건
                  </strong>
                  <p>
                    선택한 면적에서 직접 비교 가능한 최근
                    거래 건수입니다.
                  </p>
                </div>
                <div className="liquidity-value">
                  <span>최근 1년</span>
                  <strong>
                    {metrics.sameAreaTransactionCount12m}건
                  </strong>
                </div>
              </div>

              <div className="liquidity-row">
                <div className="liquidity-label">
                  <span className="liquidity-icon">
                    <ReportIcon name="history" />
                  </span>
                  <div>
                    <span>03</span>
                    <strong>거래 공백</strong>
                  </div>
                </div>
                <div className="liquidity-description">
                  <strong>
                    {metrics.monthsSinceLastTrade}개월
                  </strong>
                  <p>
                    거래 공백이 길수록 과거 실거래가의
                    현재 설명력은 낮아질 수 있습니다.
                  </p>
                </div>
                <div className="liquidity-value">
                  <span>공백 기간</span>
                  <strong>
                    {metrics.monthsSinceLastTrade}개월
                  </strong>
                </div>
              </div>
            </div>

            <section
              className="report-cause-box report-cause-box-premium"
              style={{
                minHeight: 160,
                marginTop: 28,
                padding: "25px 30px",
              }}
            >
              <div className="report-cause-content">
                <span className="report-cause-label">
                  AI 유동성 해석
                </span>
                <h4
                  style={{
                    fontSize: 24,
                    lineHeight: 1.35,
                  }}
                >
                  {liquidityAnalysisTitle}
                </h4>
                <p>
                  {liquidityAnalysisText}{" "}
                  {liquidityAnalysisText2}
                </p>
              </div>
            </section>
          </section>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 5 — 매수 반응과 병목 진단
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="05"
              title="문의에서 협상까지"
              description="실제 매수 반응이 어느 단계에서 끊기는지 확인합니다."
            />

            <div className="detail-conversion-grid">
              <div>
                <span className="conversion-icon">
                  <ReportIcon name="chat" />
                </span>
                <strong>{inquiryText}</strong>
                <span>누적 문의</span>
              </div>
              <div>
                <span className="conversion-icon">
                  <ReportIcon name="person" />
                </span>
                <strong>{visitText}</strong>
                <span>실제 방문</span>
              </div>
              <div>
                <span className="conversion-icon">
                  <ReportIcon name="handshake" />
                </span>
                <strong>{offerText}</strong>
                <span>가격 제안·협상</span>
              </div>
            </div>

            <p className="report-note">
              입력하지 않은 값은 추정하지 않습니다. 실제 횟수를
              기록하면 문의·방문·협상 중 어느 단계에서 병목이
              발생하는지 더 정확히 판단할 수 있습니다.
            </p>
          </section>

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="06"
              title="매도 병목 진단"
              description="현재 데이터에서 가장 강하게 나타나는 원인과 아직 확인할 수 없는 요소를 구분합니다."
            />

            <div className="evidence-table evidence-table-premium">
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">01</span>
                  <strong>핵심 병목</strong>
                </div>
                <div className="evidence-content">
                  <strong>{bottleneckLabel}</strong>
                  <p>{bottleneckReason}</p>
                </div>
              </div>
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">02</span>
                  <strong>근거 신호</strong>
                </div>
                <div className="evidence-content">
                  <strong>확인된 데이터</strong>
                  <p>{supportingSignal1}</p>
                </div>
              </div>
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">03</span>
                  <strong>보조 신호</strong>
                </div>
                <div className="evidence-content">
                  <strong>함께 볼 데이터</strong>
                  <p>{supportingSignal2}</p>
                </div>
              </div>
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">04</span>
                  <strong>확인 필요</strong>
                </div>
                <div className="evidence-content">
                  <strong>현재 데이터의 한계</strong>
                  <p>{uncertainty1}</p>
                </div>
              </div>
              <div className="evidence-row">
                <div className="evidence-label">
                  <span className="evidence-number">05</span>
                  <strong>추가 확인</strong>
                </div>
                <div className="evidence-content">
                  <strong>다음 판단에 필요한 정보</strong>
                  <p>{uncertainty2}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="report-action-box report-action-box-premium">
            <span className="report-action-icon">
              <ReportIcon name="target" />
            </span>
            <div>
              <span className="report-action-label">
                현재 가장 가능성 높은 병목
              </span>
              <strong>{bottleneckLabel}</strong>
              <p>{bottleneckReason}</p>
            </div>
          </section>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 6 — 가격 전략과 30일 실행 계획
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="07"
              title="가격 전략 시나리오"
              description="현재 가격을 유지하거나 조정할 때 선택할 수 있는 세 가지 전략을 비교합니다."
            />

            <div className="evidence-table evidence-table-premium">
              {scenarios.map((scenario, index) => (
                <div
                  className="evidence-row"
                  key={scenario.type}
                >
                  <div className="evidence-label">
                    <span className="evidence-number">
                      {["A", "B", "C"][index]}
                    </span>
                    <strong>{scenario.label}</strong>
                  </div>
                  <div className="evidence-content">
                    <strong>{scenario.description}</strong>
                    <p>
                      적합 조건:{" "}
                      {firstText(
                        scenario.suitableWhen,
                        "현재 시장 반응을 추가로 확인해야 합니다."
                      )}
                    </p>
                    <p>
                      확인 기준:{" "}
                      {firstText(
                        scenario.checkpoints,
                        "문의와 방문 변화를 확인합니다."
                      )}
                    </p>
                    <p>
                      위험:{" "}
                      {firstText(
                        scenario.risks,
                        "시장 반응이 예상과 다를 수 있습니다."
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="08"
              title="30일 실행 계획"
              description="단순히 기다리지 않고 앞으로 30일 동안 실제로 확인할 행동과 판단 시점을 정합니다."
            />

            <div className="detail-timeline">
              {actionPlan.map((item, index) => (
                <div
                  className="detail-timeline-row"
                  key={item.period}
                >
                  <div className="timeline-step">
                    <span>{index + 1}</span>
                    <strong>{item.period}일</strong>
                  </div>
                  <div className="timeline-content">
                    <strong>{item.title}</strong>
                    <p>
                      {firstText(
                        item.actions,
                        "현재 매도 상황을 다시 확인합니다."
                      )}
                    </p>
                    <p>
                      판단 기준:{" "}
                      {firstText(
                        item.decisionCriteria,
                        "문의와 방문 반응 변화를 확인합니다."
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <PageFooter />
        </article>

        {/* =====================================================
            PAGE 7 — 판단 트리거와 최종 전략
        ====================================================== */}
        <article className="detail-report-page">
          <InnerPageHeader />

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="09"
              title="판단 트리거"
              description="전략 변경 여부를 실제 시장 반응을 기준으로 판단합니다."
            />

            <div className="evidence-table evidence-table-premium">
              {triggers.map((trigger, index) => {
                const icons: IconName[] = [
                  "check",
                  "warning",
                  "target",
                ];
                return (
                  <div
                    className="evidence-row"
                    key={trigger.type}
                  >
                    <div className="evidence-label">
                      <span className="evidence-icon">
                        <ReportIcon name={icons[index]} />
                      </span>
                      <strong>{trigger.title}</strong>
                    </div>
                    <div className="evidence-content">
                      <strong>{trigger.condition}</strong>
                      <p>{trigger.action}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="report-section report-section-premium detail-section">
            <SectionHeader
              number="10"
              title="지금 우선할 것"
              description="전체 분석을 실제 행동으로 옮기기 위한 우선순위를 정리합니다."
            />

            <div className="evidence-table evidence-table-premium">
              {priorities.slice(0, 3).map((priority, index) => (
                <div
                  className="evidence-row"
                  key={`${priority}-${index}`}
                >
                  <div className="evidence-label">
                    <span className="evidence-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong>우선순위 {index + 1}</strong>
                  </div>
                  <div className="evidence-content">
                    <strong>{priority}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="report-cause-box report-cause-box-premium detail-cause-box">
            <div className="report-cause-content">
              <span className="report-cause-label">
                최종 전략
              </span>
              <h4>{finalHeadline}</h4>
              <p>{finalSummary}</p>
            </div>
          </section>

          <div className="report-limits report-limits-premium detail-limits">
            <div>
              <span className="report-limit-icon">
                <ReportIcon name="balance" />
              </span>
              <div>
                <strong>분석 한계</strong>
                <p>{limitations.join(" · ")}</p>
              </div>
            </div>
            <div>
              <span className="report-limit-icon">
                <ReportIcon name="database" />
              </span>
              <div>
                <strong>데이터 기준</strong>
                <p>
                  {result.dataDate}
                  &nbsp; | &nbsp;국토교통부 실거래 자동조회 ·
                  사용자 입력 정보
                </p>
              </div>
            </div>
          </div>

          <PageFooter />
        </article>
      </div>

      <StrategyEntryCard diagnosis={result} />

      <div className="report-controls">
        <button type="button" onClick={() => window.print()}>
          분석 리포트 저장·인쇄
        </button>
        <button
          type="button"
          className="ghost"
          onClick={closeReport}
        >
          종료하기
        </button>
      </div>

      <style jsx global>{`
        /* =====================================================
           V2.5 — FIRST PAGE DASHBOARD
        ===================================================== */

        .report-dashboard-page {
          display: flex;
          flex-direction: column;
          background: #fff;
        }

        .dashboard-content {
          display: flex;
          flex-direction: column;
          gap: 11px;
          padding-top: 15px;
        }

        .dashboard-hero {
          position: relative;
          overflow: hidden;
          padding: 17px 20px;
          border: 1px solid #d4e8d9;
          border-radius: 10px;
          background:
            radial-gradient(
              circle at 94% 5%,
              rgba(180, 216, 205, 0.48),
              transparent 38%
            ),
            linear-gradient(
              125deg,
              #fff 15%,
              #edf8f2 100%
            );
        }

        .dashboard-hero-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dashboard-hero-icon {
          display: flex;
          width: 31px;
          height: 31px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #e1f2e7;
          color: #156b50;
        }

        .dashboard-hero-icon svg {
          width: 18px;
          height: 18px;
        }

        .dashboard-hero-top strong {
          display: block;
          color: #224b39;
          font-size: 12px;
          line-height: 1.45;
        }

        .dashboard-hero-top p {
          margin: 2px 0 0;
          color: #66786e;
          font-size: 11px;
          line-height: 1.45;
        }

        .dashboard-hero-badge {
          display: inline-flex;
          margin-top: 12px;
          padding: 5px 10px;
          border-radius: 20px;
          background: #dff2e5;
          color: #135e45;
          font-size: 11px;
          font-weight: 800;
        }

        .dashboard-hero h3 {
          max-width: 100%;
          margin: 9px 0 0;
          color: #183e2d;
          font-size: 27px;
          line-height: 1.25;
          letter-spacing: -0.05em;
          word-break: keep-all;
        }

        .dashboard-hero-description {
          margin: 9px 0 0;
          color: #52685b;
          font-size: 12px;
          line-height: 1.65;
          word-break: keep-all;
        }

        .dashboard-hero-reason {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 10px;
          align-items: baseline;
          margin: 10px 0 0;
          padding-top: 9px;
          border-top: 1px solid #d8e6dd;
          font-size: 11px;
          line-height: 1.55;
        }

        .dashboard-hero-reason strong {
          color: #19634b;
        }

        .dashboard-hero-reason span {
          color: #486255;
        }

        .dashboard-price-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .dashboard-price-card {
          min-width: 0;
          padding: 12px 11px;
          border: 1px solid #e5e9e4;
          border-radius: 8px;
        }

        .dashboard-price-trade {
          background: #ecf7f1;
        }

        .dashboard-price-listing {
          background: #fff5e9;
        }

        .dashboard-price-asking {
          background: #fff0ee;
        }

        .dashboard-price-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #4c6155;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.4;
        }

        .dashboard-price-label svg {
          width: 15px;
          height: 15px;
          flex: 0 0 auto;
        }

        .dashboard-price-card > strong {
          display: block;
          margin-top: 7px;
          color: #205640;
          font-size: 21px;
          line-height: 1.3;
          letter-spacing: -0.04em;
          word-break: keep-all;
        }

        .dashboard-price-listing > strong {
          color: #81591f;
        }

        .dashboard-price-asking > strong {
          color: #a43d35;
        }

        .dashboard-price-card > p {
          margin: 7px 0 0;
          color: #748078;
          font-size: 10px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .dashboard-panel {
          padding: 13px;
          border: 1px solid #e8eadf;
          border-radius: 9px;
          background: #faf8ed;
        }

        .dashboard-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }

        .dashboard-section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #284e3c;
          font-size: 13px;
          font-weight: 900;
          line-height: 1.45;
        }

        .dashboard-section-kicker svg {
          width: 16px;
          height: 16px;
          color: #17684e;
        }

        .dashboard-section-heading > p {
          margin: 0;
          color: #777e72;
          font-size: 10px;
          line-height: 1.45;
          text-align: right;
        }

        .dashboard-evidence-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .dashboard-evidence-card {
          min-width: 0;
          padding: 12px 10px;
          border: 1px solid #ebe9df;
          border-radius: 7px;
          background: #fff;
        }

        .dashboard-evidence-title {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dashboard-evidence-title > span {
          display: grid;
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #12674c;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
        }

        .dashboard-evidence-title > strong {
          color: #486353;
          font-size: 11px;
          line-height: 1.4;
        }

        .dashboard-evidence-card h4 {
          margin: 8px 0 0;
          color: #294737;
          font-size: 12px;
          line-height: 1.5;
          word-break: keep-all;
        }

        .dashboard-evidence-card p {
          margin: 7px 0 0;
          color: #5d6e63;
          font-size: 10px;
          line-height: 1.6;
          word-break: keep-all;
        }

        .dashboard-cause-panel {
          background: #f5f8ef;
        }

        .dashboard-cause-list {
          display: grid;
          gap: 7px;
        }

        .dashboard-cause-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
          padding: 10px 11px;
          border: 1px solid #e4eae0;
          border-radius: 6px;
          background: #fff;
        }

        .dashboard-cause-index {
          display: grid;
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #17674e;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
        }

        .dashboard-cause-body {
          min-width: 0;
        }

        .dashboard-cause-top {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 9px;
          align-items: baseline;
        }

        .dashboard-cause-top strong {
          color: #1e513b;
          font-size: 12px;
        }

        .dashboard-cause-top span {
          color: #4c6657;
          font-size: 11px;
          font-weight: 700;
        }

        .dashboard-cause-body p {
          margin: 5px 0 0;
          color: #5d6e63;
          font-size: 10px;
          line-height: 1.6;
          word-break: keep-all;
        }

        .dashboard-action-panel {
          background: #fbf7e9;
        }

        .dashboard-action-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .dashboard-action-card {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          min-width: 0;
          padding: 12px 10px;
          border: 1px solid #ece8d9;
          border-radius: 7px;
          background: #fff;
        }

        .dashboard-action-number {
          display: grid;
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 50%;
          background: #17674e;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
        }

        .dashboard-action-card strong {
          min-width: 0;
          color: #394c3d;
          font-size: 11px;
          line-height: 1.55;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }

        .dashboard-meta {
          margin: 0;
          color: #75847a;
          font-size: 10px;
          line-height: 1.5;
          text-align: right;
        }

        @media (max-width: 680px) {
          .dashboard-content {
            gap: 11px;
          }

          .dashboard-price-grid,
          .dashboard-evidence-grid,
          .dashboard-action-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-hero h3 {
            font-size: 24px;
          }

          .dashboard-price-card > strong {
            font-size: 21px;
          }

          .dashboard-section-heading {
            align-items: flex-start;
          }

          .dashboard-section-heading > p {
            max-width: 45%;
          }
        }

        /* =====================================================
           PDF / PRINT
           브라우저의 반올림 오차로 A4 한 장이 넘지 않도록
           각 페이지 높이를 297mm보다 작게 지정합니다.
        ===================================================== */

        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          body * {
            visibility: hidden !important;
          }

          .detail-report,
          .detail-report * {
            visibility: visible !important;
          }

          .detail-report {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            display: block !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }

          .report-controls {
            display: none !important;
          }

          .detail-report-page {
            position: relative !important;
            display: block !important;
            width: 210mm !important;
            height: 296mm !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 10mm 14mm 17mm !important;
            box-sizing: border-box !important;
            border: 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid-page !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }

          /* 첫 장 뒤부터 각 리포트 페이지를 새 장에서 시작 */
          .detail-report-page + .detail-report-page {
            page-break-before: always !important;
            break-before: page !important;
          }

          /* 마지막 장 뒤에는 강제 페이지 나누기를 만들지 않음 */
          .detail-report-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          .detail-report-page .detail-section {
            margin-top: 20px !important;
          }

          .detail-report-page .report-cause-box,
          .detail-report-page .report-limits {
            margin-top: 20px !important;
          }

          .detail-report-page .evidence-row,
          .detail-report-page .liquidity-row,
          .detail-report-page .detail-timeline-row {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .report-page-footer {
            position: absolute !important;
            right: 14mm !important;
            bottom: 7mm !important;
            left: 14mm !important;
            margin: 0 !important;
          }

          /* 첫 페이지 PDF: 글자 확대와 3열 배치 유지 */
          .report-dashboard-page {
            display: flex !important;
            flex-direction: column !important;
          }

          .report-dashboard-page .dashboard-content {
            gap: 3mm !important;
            padding-top: 3mm !important;
          }

          .report-dashboard-page .dashboard-hero {
            padding: 4mm 5mm !important;
          }

          .report-dashboard-page .dashboard-hero h3 {
            font-size: 22px !important;
            line-height: 1.25 !important;
          }

          .report-dashboard-page .dashboard-hero-description {
            font-size: 11px !important;
            line-height: 1.55 !important;
          }

          .report-dashboard-page .dashboard-hero-reason {
            font-size: 10px !important;
          }

          .report-dashboard-page .dashboard-price-grid,
          .report-dashboard-page .dashboard-evidence-grid,
          .report-dashboard-page .dashboard-action-grid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            ) !important;
            gap: 2.5mm !important;
          }

          .report-dashboard-page .dashboard-price-card {
            padding: 3mm !important;
          }

          .report-dashboard-page .dashboard-price-card > strong {
            font-size: 18px !important;
          }

          .report-dashboard-page .dashboard-panel {
            padding: 3mm !important;
          }

          .report-dashboard-page .dashboard-section-kicker {
            font-size: 12px !important;
          }

          .report-dashboard-page .dashboard-section-heading > p {
            font-size: 9px !important;
          }

          .report-dashboard-page .dashboard-evidence-card,
          .report-dashboard-page .dashboard-action-card {
            padding: 3mm !important;
          }

          .report-dashboard-page .dashboard-evidence-card h4 {
            font-size: 11px !important;
          }

          .report-dashboard-page .dashboard-evidence-card p {
            font-size: 9px !important;
            line-height: 1.5 !important;
          }

          .report-dashboard-page .dashboard-cause-row {
            padding: 2.5mm 3mm !important;
          }

          .report-dashboard-page .dashboard-cause-top strong {
            font-size: 11px !important;
          }

          .report-dashboard-page .dashboard-cause-top span {
            font-size: 10px !important;
          }

          .report-dashboard-page .dashboard-cause-body p {
            font-size: 9px !important;
            line-height: 1.5 !important;
          }

          .report-dashboard-page .dashboard-action-card strong {
            font-size: 10px !important;
          }

          .report-dashboard-page .dashboard-meta {
            font-size: 9px !important;
          }
        }
      `}</style>
    </>
  );
}