"use client";

import type {
  ExecutionStrategy,
  StrategyFocus,
} from "../execution-strategy-types";

type ExecutionStrategyReportProps = {
  strategy: ExecutionStrategy;

  onBack?: () => void;
};

const focusLabels:
  Record<
    StrategyFocus,
    string
  > = {
    price:
      "가격 경쟁력",

    liquidity:
      "거래 유동성",

    exposure:
      "매물 노출",

    conversion:
      "문의·방문 전환",

    condition:
      "현장 조건",
  };

const priceStanceLabels = {
  maintain:
    "현재 가격 유지",

  conditional_adjust:
    "반응 확인 후 조건부 조정",

  adjust_within_limit:
    "허용 범위 안에서 조정",
} as const;

function formatWon(
  value: number
) {
  if (value >= 10000) {
    const eok =
      Math.floor(
        value / 10000
      );

    const remainder =
      value % 10000;

    return remainder === 0
      ? `${eok}억원`
      : `${eok}억 ${remainder.toLocaleString(
          "ko-KR"
        )}만원`;
  }

  return `${value.toLocaleString(
    "ko-KR"
  )}만원`;
}

function formatCount(
  value: number | null
) {
  return value === null
    ? "미입력"
    : `${value.toLocaleString(
        "ko-KR"
      )}회`;
}

function ReportHeader({
  page,
  title,
}: {
  page: string;
  title: string;
}) {
  return (
    <header className="strategy-page-header">
      <div>
        <span>
          30일 매도 실행전략
        </span>

        <strong>
          {title}
        </strong>
      </div>

      <span>
        {page}
      </span>
    </header>
  );
}

function ReportFooter({
  strategyId,
}: {
  strategyId: string;
}) {
  return (
    <footer className="strategy-page-footer">
      <span>
        데이터 + 사용자 입력 기반 실행전략
      </span>

      <span>
        {strategyId}
      </span>
    </footer>
  );
}

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="strategy-section-title">
      <span>
        {number}
      </span>

      <div>
        <h2>
          {title}
        </h2>

        {description && (
          <p>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ExecutionStrategyReport({
  strategy,
  onBack,
}: ExecutionStrategyReportProps) {
  const snapshot =
    strategy.propertySnapshot;

  const recommended =
    strategy.recommendedStrategy;

  const branchGroups = [
    strategy.responseBranches.slice(
      0,
      2
    ),

    strategy.responseBranches.slice(
      2,
      4
    ),
  ];

  const checklistPageGroups = [
    strategy.checklistGroups.slice(
      0,
      2
    ),

    strategy.checklistGroups.slice(
      2,
      4
    ),
  ];

  return (
    <div className="strategy-report-shell">
      <div className="strategy-report-controls">
        <button
          type="button"
          onClick={() =>
            window.print()
          }
        >
          인쇄·PDF 저장
        </button>

        {onBack && (
          <button
            type="button"
            className="secondary"
            onClick={
              onBack
            }
          >
            진단 리포트로 돌아가기
          </button>
        )}
      </div>

      <div className="strategy-report">
        {/* PAGE 1 */}
        <article className="strategy-page strategy-cover-page">
          <ReportHeader
            page="01 / 14"
            title="현재 상태와 30일 목표"
          />

          <section className="strategy-cover">
            <p className="strategy-kicker">
              30 DAY ACTION
            </p>

            <h1>
              {strategy.objective
                .headline}
            </h1>

            <p className="strategy-cover-summary">
              {strategy.objective
                .summary}
            </p>
          </section>

          <section className="strategy-property-card">
            <span>
              대상 매물
            </span>

            <h2>
              {snapshot.apartmentName}
            </h2>

            <p>
              {snapshot.complex}
              <br />
              {snapshot.area}
            </p>

            <div className="strategy-metric-grid">
              <div>
                <span>
                  현재 희망가
                </span>

                <strong>
                  {formatWon(
                    snapshot.askingPrice
                  )}
                </strong>
              </div>

              <div>
                <span>
                  등록 기간
                </span>

                <strong>
                  {snapshot.listedDays}일
                </strong>
              </div>

              <div>
                <span>
                  문의
                </span>

                <strong>
                  {formatCount(
                    snapshot.inquiries
                  )}
                </strong>
              </div>

              <div>
                <span>
                  방문
                </span>

                <strong>
                  {formatCount(
                    snapshot.visits
                  )}
                </strong>
              </div>

              <div>
                <span>
                  제안
                </span>

                <strong>
                  {formatCount(
                    snapshot.offers
                  )}
                </strong>
              </div>
            </div>
          </section>

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>

        {/* PAGE 2 */}
        <article className="strategy-page">
          <ReportHeader
            page="02 / 14"
            title="30일 목표와 성공 신호"
          />

          <section className="strategy-section">
            <SectionTitle
              number="01"
              title="30일 성공 신호"
              description="거래 성사가 아니라 전략이 작동하고 있는지 판단할 중간 신호입니다."
            />

            <ol className="strategy-number-list">
              {strategy.objective
                .successSignals
                .map(
                  (
                    signal,
                    index
                  ) => (
                    <li
                      key={
                        signal
                      }
                    >
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <p>
                        {signal}
                      </p>
                    </li>
                  )
                )}
            </ol>
          </section>

          {strategy.objective
            .constraintConflicts
            .length > 0 && (
            <section className="strategy-warning-box">
              <strong>
                조건 충돌 확인
              </strong>

              <ul>
                {strategy.objective
                  .constraintConflicts
                  .map(
                    (conflict) => (
                      <li
                        key={
                          conflict
                        }
                      >
                        {conflict}
                      </li>
                    )
                  )}
              </ul>
            </section>
          )}

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>

        {/* PAGE 3 */}
        <article className="strategy-page">
          <ReportHeader
            page="03 / 14"
            title="권장 전략"
          />

          <section className="strategy-section">
            <SectionTitle
              number="02"
              title="이번 30일의 권장 전략"
              description="여러 선택지를 나열하지 않고 현재 조건에서 우선할 전략 하나를 정합니다."
            />

            <div className="strategy-primary-card">
              <div className="strategy-tag-row">
                <span>
                  {
                    focusLabels[
                      recommended
                        .primaryFocus
                    ]
                  }
                </span>

                <span>
                  {
                    priceStanceLabels[
                      recommended
                        .priceStance
                    ]
                  }
                </span>
              </div>

              <h2>
                {recommended.headline}
              </h2>

              <p>
                {recommended.summary}
              </p>
            </div>
          </section>

          <section className="strategy-section">
            <SectionTitle
              number="03"
              title="이 전략을 선택한 이유"
            />

            <ol className="strategy-number-list">
              {recommended.reasons.map(
                (
                  reason,
                  index
                ) => (
                  <li
                    key={
                      reason
                    }
                  >
                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p>
                      {reason}
                    </p>
                  </li>
                )
              )}
            </ol>
          </section>

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>

        {/* PAGE 4 */}
        <article className="strategy-page">
          <ReportHeader
            page="04 / 14"
            title="전략 유지·변경 조건"
          />

          <section className="strategy-section">
            <SectionTitle
              number="03"
              title="전략을 유지하거나 변경할 때"
              description="30일 동안 관찰한 반응을 기준으로 다음 행동을 결정합니다."
            />

            <div className="strategy-two-column">
              <div className="strategy-condition-card maintain">
                <span>
                  전략 유지 조건
                </span>

                <ul>
                  {recommended
                    .maintainConditions
                    .map(
                      (condition) => (
                        <li
                          key={
                            condition
                          }
                        >
                          {condition}
                        </li>
                      )
                    )}
                </ul>
              </div>

              <div className="strategy-condition-card change">
                <span>
                  전략 변경 조건
                </span>

                <ul>
                  {recommended
                    .changeConditions
                    .map(
                      (condition) => (
                        <li
                          key={
                            condition
                          }
                        >
                          {condition}
                        </li>
                      )
                    )}
                </ul>
              </div>
            </div>
          </section>

          <section className="strategy-avoid-box">
            <strong>
              이번 30일 동안 피할 행동
            </strong>

            <ul>
              {recommended
                .avoidActions
                .map(
                  (action) => (
                    <li
                      key={
                        action
                      }
                    >
                      {action}
                    </li>
                  )
                )}
            </ul>
          </section>

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>

        {/* PAGES 5-8: WEEK 1-4 */}
        {strategy.weeklyPlans.map(
          (
            week,
            weekIndex
          ) => (
            <article
              className="strategy-page"
              key={
                week.period
              }
            >
              <ReportHeader
                page={`${String(
                  weekIndex + 5
                ).padStart(
                  2,
                  "0"
                )} / 14`}
                title={`${weekIndex + 1}주차 실행계획`}
              />

              <section className="strategy-week-card strategy-week-card-single">
                  <header>
                    <span>
                      WEEK{" "}
                      {weekIndex + 1}
                    </span>

                    <strong>
                      {week.period}일
                    </strong>
                  </header>

                  <h3>
                    {week.title}
                  </h3>

                  <p className="week-objective">
                    {week.objective}
                  </p>

                  <div className="week-columns">
                    <div>
                      <span className="week-label">
                        관찰
                      </span>

                      {week.observations.map(
                        (
                          observation
                        ) => (
                          <div
                            className="week-item"
                            key={
                              observation.item
                            }
                          >
                            <strong>
                              {
                                observation.item
                              }
                            </strong>

                            <p>
                              {
                                observation.method
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <div>
                      <span className="week-label">
                        판단 기준
                      </span>

                      {week.decisionCriteria.map(
                        (
                          criterion
                        ) => (
                          <div
                            className="week-item"
                            key={
                              criterion.condition
                            }
                          >
                            <strong>
                              {
                                criterion.condition
                              }
                            </strong>

                            <p>
                              {
                                criterion.meaning
                              }
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="week-actions">
                    <span className="week-label">
                      행동
                    </span>

                    {week.actions.map(
                      (
                        action,
                        actionIndex
                      ) => (
                        <div
                          className="week-action"
                          key={
                            action.title
                          }
                        >
                          <span>
                            {actionIndex +
                              1}
                          </span>

                          <div>
                            <strong>
                              {
                                action.title
                              }
                            </strong>

                            <p>
                              {
                                action.detail
                              }
                            </p>

                            <small>
                              완료 확인:{" "}
                              {
                                action.completionCheck
                              }
                            </small>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <p className="next-condition">
                    다음 단계 조건:{" "}
                    <strong>
                      {
                        week.nextStepCondition
                      }
                    </strong>
                  </p>
              </section>

              <ReportFooter
                strategyId={
                  strategy.strategyId
                }
              />
            </article>
          )
        )}

        {/* PAGES 9-10: RESPONSE BRANCHES */}
        {branchGroups.map(
          (
            branches,
            groupIndex
          ) => (
            <article
              className="strategy-page"
              key={`branch-group-${groupIndex}`}
            >
              <ReportHeader
                page={`${String(
                  groupIndex + 9
                ).padStart(
                  2,
                  "0"
                )} / 14`}
                title="매수 반응별 행동 분기"
              />

              <section className="strategy-section">
                <SectionTitle
                  number="06"
                  title={
                    groupIndex === 0
                      ? "문의와 방문 단계"
                      : "제안과 계약 단계"
                  }
                  description="문의·방문·제안 중 어디에서 멈췄는지에 따라 다음 점검 대상을 바꿉니다."
                />

                <div className="strategy-branch-list">
                  {branches.map(
                    (
                      branch,
                      branchIndex
                    ) => {
                      const absoluteIndex =
                        groupIndex *
                          2 +
                        branchIndex;

                      return (
                        <article
                          className="strategy-branch-card"
                          key={
                            branch.stage
                          }
                        >
                          <span>
                            {String(
                              absoluteIndex +
                                1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <div>
                            <h3>
                              {branch.label}
                            </h3>

                            <p>
                              <strong>
                                관찰:{" "}
                              </strong>
                              {
                                branch.observation
                              }
                            </p>

                            <p>
                              <strong>
                                해석:{" "}
                              </strong>
                              {
                                branch.interpretation
                              }
                            </p>

                            <ul>
                              {branch.actions.map(
                                (
                                  action
                                ) => (
                                  <li
                                    key={
                                      action
                                    }
                                  >
                                    {action}
                                  </li>
                                )
                              )}
                            </ul>

                            <small>
                              다시 판단할 때:{" "}
                              {
                                branch.reassessWhen
                              }
                            </small>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </section>

              <ReportFooter
                strategyId={
                  strategy.strategyId
                }
              />
            </article>
          )
        )}

        {/* PAGES 11-12: CHECKLIST */}
        {checklistPageGroups.map(
          (
            groups,
            groupIndex
          ) => (
            <article
              className="strategy-page"
              key={`checklist-page-${groupIndex}`}
            >
              <ReportHeader
                page={`${String(
                  groupIndex + 11
                ).padStart(
                  2,
                  "0"
                )} / 14`}
                title="실전 점검표"
              />

              <section className="strategy-section">
                <SectionTitle
                  number="07"
                  title={
                    groupIndex === 0
                      ? "노출과 중개 상태 점검"
                      : "매물 정보와 방문 조건 점검"
                  }
                  description="확인한 항목에 직접 표시하고 필요한 내용을 기록합니다."
                />

                <div className="strategy-checklist-grid strategy-checklist-grid-page">
                  {groups.map(
                    (group) => (
                      <section
                        className="strategy-checklist-card"
                        key={
                          group.type
                        }
                      >
                        <h3>
                          {group.title}
                        </h3>

                        {group.items.map(
                          (item) => (
                            <label
                              key={
                                item.label
                              }
                            >
                              <input
                                type="checkbox"
                              />

                              <span>
                                <strong>
                                  {
                                    item.label
                                  }
                                </strong>

                                <small>
                                  {
                                    item.reason
                                  }
                                </small>
                              </span>

                              <em>
                                {item.priority ===
                                "required"
                                  ? "필수"
                                  : "권장"}
                              </em>
                            </label>
                          )
                        )}
                      </section>
                    )
                  )}
                </div>
              </section>

              <ReportFooter
                strategyId={
                  strategy.strategyId
                }
              />
            </article>
          )
        )}

        {/* PAGE 13 */}
        <article className="strategy-page">
          <ReportHeader
            page="13 / 14"
            title="변화 기록표"
          />

          <section className="strategy-section">
            <SectionTitle
              number="08"
              title="30일 변화 기록"
              description="미래 수치를 예측하지 않고 실제로 확인한 값을 직접 기록합니다."
            />

            <div className="strategy-table-wrap">
              <table className="strategy-tracking-table">
                <thead>
                  <tr>
                    <th>
                      지표
                    </th>

                    {strategy.trackingPlan
                      .checkpoints
                      .map(
                        (
                          checkpoint
                        ) => (
                          <th
                            key={
                              checkpoint.day
                            }
                          >
                            {
                              checkpoint.label
                            }
                          </th>
                        )
                      )}
                  </tr>
                </thead>

                <tbody>
                  {strategy.trackingPlan
                    .metrics
                    .map(
                      (metric) => (
                        <tr
                          key={
                            metric.key
                          }
                        >
                          <th>
                            {
                              metric.label
                            }
                          </th>

                          <td>
                            {
                              metric.baseline
                            }
                          </td>

                          <td />
                          <td />
                          <td />
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="strategy-record-guide">
            <strong>
              기록 원칙
            </strong>

            <ul>
              <li>
                확인하지 못한 값은 0이 아니라 빈칸으로 둡니다.
              </li>

              <li>
                문의·방문·제안은 중개업소별 기록을 합산합니다.
              </li>

              <li>
                가격이나 노출 조건을 바꾼 날짜를 함께 적습니다.
              </li>
            </ul>
          </section>

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>

        {/* PAGE 14 */}
        <article className="strategy-page">
          <ReportHeader
            page="14 / 14"
            title="30일 종료 판단"
          />

          <section className="strategy-section">
            <SectionTitle
              number="09"
              title="30일 종료 판단"
              description={strategy.day30Decision.summary}
            />

            <div className="strategy-outcome-list">
              {strategy.day30Decision
                .outcomes
                .map(
                  (
                    outcome,
                    index
                  ) => (
                    <article
                      key={
                        outcome.type
                      }
                    >
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>
                        <strong>
                          {
                            outcome.condition
                          }
                        </strong>

                        <p>
                          {
                            outcome.action
                          }
                        </p>
                      </div>
                    </article>
                  )
                )}
            </div>
          </section>

          <section className="strategy-limitations">
            <strong>
              분석 한계
            </strong>

            <ul>
              {strategy.limitations.map(
                (
                  limitation
                ) => (
                  <li
                    key={
                      limitation
                    }
                  >
                    {limitation}
                  </li>
                )
              )}
            </ul>
          </section>

          <ReportFooter
            strategyId={
              strategy.strategyId
            }
          />
        </article>
      </div>

      <style jsx global>{`
        .strategy-report-shell {
          min-height: 100vh;
          padding: 28px 0 72px;
          background: #e9e7df;
          color: #17231d;
        }

        .strategy-report-controls {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .strategy-report-controls button {
          min-height: 46px;
          padding: 0 18px;
          border: 0;
          background: #0b684d;
          color: #fff;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .strategy-report-controls button.secondary {
          border: 1px solid #9ca9a1;
          background: transparent;
          color: #31453a;
        }

        .strategy-report {
          display: grid;
          gap: 28px;
        }

        .strategy-page {
          position: relative;
          width: min(1120px, calc(100% - 32px));
          min-height: 1420px;
          margin: 0 auto;
          padding: 46px 52px 80px;
          box-sizing: border-box;
          border: 1px solid #ced4d0;
          background: #fff;
        }

        .strategy-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #17231d;
        }

        .strategy-page-header div {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .strategy-page-header div span,
        .strategy-page-header div strong,
        .strategy-page-header > span {
          display: block;
        }

        .strategy-page-header div span,
        .strategy-page-header > span {
          color: #6d7972;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .strategy-page-header strong {
          font-size: 14px;
        }

        .strategy-page-header > span {
          flex: 0 0 auto;
          text-align: right;
        }

        .strategy-cover {
          padding: 64px 0 44px;
          border-bottom: 1px solid #d9ddd9;
        }

        .strategy-kicker {
          margin: 0;
          color: #0b684d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .strategy-cover h1 {
          max-width: 820px;
          margin: 20px 0 0;
          font-size: clamp(38px, 6vw, 64px);
          line-height: 1.16;
          letter-spacing: -0.06em;
        }

        .strategy-cover-summary {
          max-width: 760px;
          margin: 24px 0 0;
          color: #596960;
          font-size: 16px;
          line-height: 1.85;
        }

        .strategy-property-card {
          margin-top: 30px;
          padding: 26px;
          background: #f4f2ea;
        }

        .strategy-property-card > span {
          color: #0b684d;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .strategy-property-card h2 {
          margin: 12px 0 0;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .strategy-property-card > p {
          margin: 10px 0 0;
          color: #607069;
          line-height: 1.7;
        }

        .strategy-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          margin-top: 22px;
          border-top: 1px solid #d2d7d3;
          border-left: 1px solid #d2d7d3;
        }

        .strategy-metric-grid div {
          min-height: 82px;
          padding: 14px;
          border-right: 1px solid #d2d7d3;
          border-bottom: 1px solid #d2d7d3;
          background: #fff;
        }

        .strategy-metric-grid span,
        .strategy-metric-grid strong {
          display: block;
        }

        .strategy-metric-grid span {
          color: #758078;
          font-size: 11px;
        }

        .strategy-metric-grid strong {
          margin-top: 8px;
          font-size: 16px;
        }

        .strategy-section {
          margin-top: 36px;
        }

        .strategy-section-title {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .strategy-section-title > span {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          flex: 0 0 auto;
          background: #0b684d;
          color: #fff;
          font-size: 11px;
          font-weight: 900;
        }

        .strategy-section-title h2 {
          margin: 0;
          font-size: 25px;
          letter-spacing: -0.04em;
        }

        .strategy-section-title p {
          margin: 8px 0 0;
          color: #68766f;
          font-size: 13px;
          line-height: 1.7;
        }

        .strategy-number-list {
          margin: 22px 0 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid #d6dcd7;
        }

        .strategy-number-list li {
          display: grid;
          grid-template-columns: 52px 1fr;
          align-items: start;
          padding: 16px 0;
          border-bottom: 1px solid #d6dcd7;
          break-inside: avoid;
        }

        .strategy-number-list li span {
          color: #0b684d;
          font-size: 12px;
          font-weight: 900;
        }

        .strategy-number-list li p {
          margin: 0;
          line-height: 1.7;
        }

        .strategy-warning-box,
        .strategy-avoid-box,
        .strategy-limitations,
        .strategy-record-guide {
          margin-top: 26px;
          padding: 20px 22px;
          border-left: 4px solid #b36b3e;
          background: #fff6ef;
          break-inside: avoid;
        }

        .strategy-record-guide {
          border-left-color: #0b684d;
          background: #eef4ef;
        }

        .strategy-warning-box ul,
        .strategy-avoid-box ul,
        .strategy-limitations ul,
        .strategy-record-guide ul {
          margin: 11px 0 0;
          padding-left: 20px;
          color: #5f665f;
          line-height: 1.75;
        }

        .strategy-primary-card {
          margin-top: 24px;
          padding: 30px;
          border: 1px solid #0b684d;
          background: #eef4ef;
          break-inside: avoid;
        }

        .strategy-tag-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .strategy-tag-row span {
          padding: 6px 9px;
          background: #0b684d;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .strategy-primary-card h2 {
          margin: 20px 0 0;
          font-size: 32px;
          line-height: 1.3;
          letter-spacing: -0.045em;
        }

        .strategy-primary-card p {
          margin: 14px 0 0;
          color: #53645a;
          line-height: 1.8;
        }

        .strategy-two-column,
        .week-columns,
        .strategy-checklist-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .strategy-two-column {
          margin-top: 26px;
        }

        .strategy-condition-card {
          padding: 22px;
          border-top: 4px solid #0b684d;
          background: #f3f6f3;
          break-inside: avoid;
        }

        .strategy-condition-card.change {
          border-color: #b36b3e;
          background: #fff6ef;
        }

        .strategy-condition-card > span {
          font-size: 13px;
          font-weight: 900;
        }

        .strategy-condition-card ul {
          margin: 14px 0 0;
          padding-left: 20px;
          line-height: 1.75;
        }

        .strategy-week-list {
          display: grid;
          gap: 28px;
          margin-top: 26px;
        }

        .strategy-week-card {
          padding: 24px;
          border: 1px solid #ccd4cf;
        }

        .strategy-week-card-single {
          margin-top: 24px;
        }

        .strategy-week-card > header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #0b684d;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .strategy-week-card h3 {
          margin: 14px 0 0;
          font-size: 24px;
          letter-spacing: -0.035em;
        }

        .week-objective {
          margin: 10px 0 0;
          color: #607069;
          line-height: 1.7;
        }

        .week-columns {
          margin-top: 20px;
        }

        .week-columns > div,
        .week-actions {
          padding: 18px;
          background: #f6f6f1;
        }

        .week-label {
          display: block;
          margin-bottom: 11px;
          color: #0b684d;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .week-item + .week-item {
          margin-top: 13px;
          padding-top: 13px;
          border-top: 1px solid #d7dcd8;
        }

        .week-item strong,
        .week-item p {
          display: block;
        }

        .week-item strong {
          font-size: 13px;
        }

        .week-item p {
          margin: 6px 0 0;
          color: #637169;
          font-size: 12px;
          line-height: 1.6;
        }

        .week-actions {
          margin-top: 15px;
        }

        .week-action {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          padding: 12px 0;
          break-inside: avoid;
        }

        .week-action + .week-action {
          border-top: 1px solid #d7dcd8;
        }

        .week-action > span {
          display: grid;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 50%;
          background: #0b684d;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
        }

        .week-action p {
          margin: 5px 0 0;
          color: #5f6e65;
          font-size: 12px;
          line-height: 1.6;
        }

        .week-action small {
          display: block;
          margin-top: 6px;
          color: #77827b;
          line-height: 1.5;
        }

        .next-condition {
          margin: 15px 0 0;
          padding: 13px 15px;
          background: #eef4ef;
          color: #415248;
          font-size: 12px;
          line-height: 1.6;
        }

        .strategy-branch-list {
          display: grid;
          gap: 16px;
          margin-top: 24px;
        }

        .strategy-branch-card {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 16px;
          padding: 20px;
          border: 1px solid #d1d7d3;
          break-inside: avoid;
        }

        .strategy-branch-card > span {
          color: #0b684d;
          font-size: 13px;
          font-weight: 900;
        }

        .strategy-branch-card h3 {
          margin: 0;
          font-size: 20px;
        }

        .strategy-branch-card p {
          margin: 9px 0 0;
          color: #58675f;
          font-size: 13px;
          line-height: 1.65;
        }

        .strategy-branch-card ul {
          margin: 11px 0 0;
          padding-left: 20px;
          line-height: 1.65;
        }

        .strategy-branch-card small {
          display: block;
          margin-top: 12px;
          color: #7a857e;
        }

        .strategy-checklist-grid {
          margin-top: 24px;
        }

        .strategy-checklist-grid-page {
          grid-template-columns: 1fr;
        }

        .strategy-checklist-card {
          padding: 20px;
          border: 1px solid #d0d7d2;
          break-inside: avoid;
        }

        .strategy-checklist-card h3 {
          margin: 0 0 13px;
          font-size: 18px;
        }

        .strategy-checklist-card label {
          position: relative;
          display: grid;
          grid-template-columns: 20px 1fr auto;
          gap: 9px;
          align-items: start;
          padding: 13px 0;
          border-top: 1px solid #e0e4e1;
          break-inside: avoid;
        }

        .strategy-checklist-card input {
          margin-top: 3px;
        }

        .strategy-checklist-card label span strong,
        .strategy-checklist-card label span small {
          display: block;
        }

        .strategy-checklist-card label span strong {
          font-size: 13px;
        }

        .strategy-checklist-card label span small {
          margin-top: 5px;
          color: #69766e;
          line-height: 1.5;
        }

        .strategy-checklist-card em {
          padding: 3px 5px;
          background: #eef4ef;
          color: #0b684d;
          font-size: 9px;
          font-style: normal;
          font-weight: 900;
        }

        .strategy-table-wrap {
          margin-top: 24px;
          overflow-x: auto;
        }

        .strategy-tracking-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }

        .strategy-tracking-table th,
        .strategy-tracking-table td {
          height: 64px;
          padding: 10px;
          border: 1px solid #cfd6d1;
          text-align: center;
        }

        .strategy-tracking-table thead th,
        .strategy-tracking-table tbody th {
          background: #f3f4ef;
          font-size: 12px;
        }

        .strategy-tracking-table td {
          font-size: 12px;
        }

        .strategy-outcome-list {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .strategy-outcome-list article {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 14px;
          padding: 17px;
          border: 1px solid #d1d8d3;
          break-inside: avoid;
        }

        .strategy-outcome-list article > span {
          color: #0b684d;
          font-size: 12px;
          font-weight: 900;
        }

        .strategy-outcome-list p {
          margin: 7px 0 0;
          color: #637169;
          font-size: 13px;
          line-height: 1.65;
        }

        .strategy-page-footer {
          position: absolute;
          right: 52px;
          bottom: 30px;
          left: 52px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #d8ddd9;
          color: #7b857f;
          font-size: 9px;
        }

        .strategy-page-footer span {
          display: block;
          min-width: 0;
        }

        .strategy-page-footer span:last-child {
          text-align: right;
        }

        @media screen and (max-width: 760px) {
          .strategy-page {
            width: min(100% - 20px, 1120px);
            min-height: 0;
            padding: 28px 22px 70px;
          }

          .strategy-metric-grid,
          .strategy-two-column,
          .week-columns,
          .strategy-checklist-grid {
            grid-template-columns: 1fr;
          }

          .strategy-cover {
            padding-top: 48px;
          }

          .strategy-page-footer {
            right: 22px;
            left: 22px;
          }

          .strategy-page-footer span:last-child {
            display: none;
          }
        }

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

          .strategy-report-shell,
          .strategy-report-shell * {
            visibility: visible !important;
          }

          .strategy-report-shell {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm;
            min-height: 0;
            padding: 0;
            background: #fff;
          }

          .strategy-report-controls {
            display: none !important;
          }

          .strategy-report {
            display: block;
          }

          .strategy-page {
            width: 210mm;
            min-height: 296mm;
            margin: 0;
            padding: 11mm 12mm 18mm;
            border: 0;
            page-break-inside: auto;
            break-inside: auto;
            page-break-after: auto;
            break-after: page;
          }

          .strategy-page:last-child {
            break-after: auto;
          }

          .strategy-page-footer {
            right: 12mm;
            bottom: 7mm;
            left: 12mm;
          }

          .strategy-cover h1 {
            font-size: 40px;
          }

          .strategy-section {
            margin-top: 8mm;
          }
        }
      `}</style>
    </div>
  );
}