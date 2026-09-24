
import type { Diagnosis } from "./report-types";

type ReportFirstPageProps = {
  result: Diagnosis;
};

export default function ReportFirstPage({
  result,
}: ReportFirstPageProps) {
  const ai = result.aiDetailAnalysis;

  const headline =
    ai?.executiveDiagnosis.headline ||
    result.headline;

  const summary =
    ai?.executiveDiagnosis.summary ||
    result.summary;

  const reason =
    ai?.executiveDiagnosis.keyReason ||
    result.label;

  const firstAction =
    ai?.finalStrategy.priorities?.[0]?.trim() ||
    result.actionTitle;

  const actionDescription =
    result.actionDescription?.trim() ||
    "현재 매도 상황과 실제 매수 반응을 확인한 뒤 다음 대응을 검토합니다.";

  return (
    <article className="detail-report-page report-first-page-v25">
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

      <section className="report-first-intro">
        <p className="report-eyebrow">
          아파트 매도 정체 진단 리포트
        </p>

        <h3>
          {result.apartmentName}
          <br />
          매도 진단 결과
        </h3>

        <p className="report-first-property">
          {result.complex} · {result.area}
        </p>

        <div className="report-first-meta">
          <span>희망가 {result.askingPrice}</span>
          <span>등록 {result.metrics.listedDays}일</span>
          <span>작성일 {result.createdAt}</span>
        </div>
      </section>

      <section className="report-first-conclusion">
        <span className="report-first-kicker">
          현재 가장 가능성 높은 정체 요인 · {reason}
        </span>

        <h4>{headline}</h4>

        <p>{summary}</p>
      </section>

      <section className="report-first-evidence">
        <div className="report-first-heading">
          <span>01</span>

          <div>
            <h4>이렇게 판단한 근거 3가지</h4>
            <p>
              현재 입력 정보와 거래 데이터를 바탕으로
              확인한 판단 근거입니다.
            </p>
          </div>
        </div>

        <div className="report-first-evidence-grid">
          {result.evidence.slice(0, 3).map((item, index) => (
            <div
              className="report-first-evidence-card"
              key={`${item.number}-${index}`}
            >
              <span className="report-first-evidence-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong>{item.label}</strong>

              <h5>{item.title}</h5>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="report-first-action">
        <span className="report-first-action-label">
          02 · 지금 먼저 할 일
        </span>

        <h4>{firstAction}</h4>

        <p>{actionDescription}</p>
      </section>

      <p className="report-first-next">
        다음 페이지에서 상세 판단 근거, 가격·시장 해석,
        대응 시나리오와 전략 변경 기준을 확인할 수 있습니다.
      </p>

      <footer className="report-page-footer">
        <span>데이터 + AI 기반 매도 분석</span>
        <span>거래 성사를 보장하지 않습니다.</span>
      </footer>
    </article>
  );
}