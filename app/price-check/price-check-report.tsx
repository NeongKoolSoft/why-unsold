"use client";

import type {
  PriceCheckReport,
} from "../price-check-types";

type PriceCheckReportProps = {
  report:
    PriceCheckReport;
  onBack?: () => void;
};

function formatPrice(
  price: number | null
) {
  if (
    price === null
  ) {
    return "확인 불가";
  }

  const roundedPrice =
    Math.round(price);

  const sign =
    roundedPrice < 0
      ? "-"
      : "";

  const absolutePrice =
    Math.abs(
      roundedPrice
    );

  const eok =
    Math.floor(
      absolutePrice /
        10000
    );

  const manwon =
    absolutePrice %
    10000;

  if (
    eok > 0 &&
    manwon > 0
  ) {
    return `${sign}${eok.toLocaleString(
      "ko-KR"
    )}억 ${manwon.toLocaleString(
      "ko-KR"
    )}만원`;
  }

  if (
    eok > 0
  ) {
    return `${sign}${eok.toLocaleString(
      "ko-KR"
    )}억원`;
  }

  return `${sign}${manwon.toLocaleString(
    "ko-KR"
  )}만원`;
}

function formatDifference(
  difference: number | null
) {
  if (
    difference === null
  ) {
    return "확인 불가";
  }

  const formatted =
    formatPrice(
      difference
    );

  return difference > 0
    ? `+${formatted}`
    : formatted;
}

function formatPercent(
  percent: number | null
) {
  if (
    percent === null
  ) {
    return "확인 불가";
  }

  const sign =
    percent > 0
      ? "+"
      : "";

  return `${sign}${percent}%`;
}

function formatArea(
  area: number
) {
  return Number.isInteger(area)
    ? String(area)
    : area.toFixed(2);
}

export default function PriceCheckReportView({
  report,
  onBack,
}: PriceCheckReportProps) {
  return (
    <section className="price-report-wrap">
      <article className="price-report-page">
        <header className="price-report-header">
          <div className="price-report-brand">
            <span aria-hidden="true">
              ?
            </span>

            <div>
              <strong>
                왜 안 팔릴까?
              </strong>

              <small>
                아파트 매도 진단
              </small>
            </div>
          </div>

          <div className="price-report-code">
            <strong>
              매도 전 가격 진단
            </strong>

            <span>
              {report.reportId}
            </span>
          </div>
        </header>

        <section className="price-report-title">
          <p>
            PRICE POSITION
          </p>

          <h1>
            {
              report
                .judgment
                .headline
            }
          </h1>

          <span>
            {
              report
                .property
                .regionName
            }{" "}
            {
              report
                .property
                .districtName
            }{" "}
            {
              report
                .property
                .legalDong
            }{" "}
            ·{" "}
            {
              report
                .property
                .apartmentName
            }{" "}
            · 전용{" "}
            {formatArea(
              report
                .property
                .exclusiveArea
            )}
            ㎡
          </span>
        </section>

        <section className="judgment-box">
          <p>
            가격 위치
          </p>

          <strong>
            {
              report
                .judgment
                .label
            }
          </strong>

          <span>
            {
              report
                .judgment
                .summary
            }
          </span>
        </section>

        <section className="price-metrics">
          <div>
            <span>
              입력한 희망가격
            </span>

            <strong>
              {formatPrice(
                report
                  .metrics
                  .askingPrice
              )}
            </strong>
          </div>

          <div>
            <span>
              최근 동일 면적 실거래
            </span>

            <strong>
              {formatPrice(
                report
                  .metrics
                  .latestTradePrice
              )}
            </strong>
          </div>

          <div>
            <span>
              가격 차이
            </span>

            <strong>
              {formatDifference(
                report
                  .metrics
                  .priceDifference
              )}
            </strong>

            <small>
              {formatPercent(
                report
                  .metrics
                  .priceGapPercent
              )}
            </small>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>
              01
            </span>

            <div>
              <p>
                판단 근거
              </p>

              <h2>
                가격 위치를 판단한
                핵심 숫자
              </h2>
            </div>
          </div>

          <div className="evidence-list">
            {report.evidence.map(
              (
                evidence,
                index
              ) => (
                <article
                  key={`${evidence.label}-${index}`}
                >
                  <div>
                    <span>
                      {String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <strong>
                      {
                        evidence.label
                      }
                    </strong>
                  </div>

                  <b>
                    {
                      evidence.value
                    }
                  </b>

                  <p>
                    {
                      evidence.description
                    }
                  </p>
                </article>
              )
            )}
          </div>
        </section>

        <section className="report-section print-page-two">
          <div className="report-section-title">
            <span>
              02
            </span>

            <div>
              <p>
                매물 등록 전
              </p>

              <h2>
                지금 확인할 것
              </h2>
            </div>
          </div>

          <ol className="checkpoint-list">
            {report.checkpoints.map(
              (
                checkpoint,
                index
              ) => (
                <li
                  key={`${checkpoint}-${index}`}
                >
                  <span>
                    {String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <p>
                    {
                      checkpoint
                    }
                  </p>
                </li>
              )
            )}
          </ol>
        </section>

        <section className="report-section">
          <div className="report-section-title">
            <span>
              03
            </span>

            <div>
              <p>
                해석 범위
              </p>

              <h2>
                결과를 볼 때
                참고하세요
              </h2>
            </div>
          </div>

          <ul className="limitation-list">
            {report.limitations.map(
              (
                limitation,
                index
              ) => (
                <li
                  key={`${limitation}-${index}`}
                >
                  {
                    limitation
                  }
                </li>
              )
            )}
          </ul>
        </section>

        <footer className="price-report-footer">
          <span>
            자료 기준일{" "}
            {
              report.dataDate
            }
          </span>

          <span>
            생성일{" "}
            {new Date(
              report.createdAt
            ).toLocaleDateString(
              "ko-KR"
            )}
          </span>

          <span>
            {
              report.reportId
            }
          </span>
        </footer>
      </article>

      <div className="report-controls">
        <button
          type="button"
          onClick={() =>
            window.print()
          }
        >
          인쇄·PDF 저장
        </button>

        {onBack ? (
          <button
            className="ghost"
            type="button"
            onClick={
              onBack
            }
          >
            메인으로 돌아가기
          </button>
        ) : null}
      </div>

      <style jsx>{`
        .price-report-wrap {
          width: min(
            980px,
            calc(100% - 40px)
          );
          margin: 0 auto;
          color:
            var(--ink);
        }

        .price-report-page {
          position: relative;
          min-height: 1280px;
          padding:
            54px 58px 90px;
          border: 1px solid
            #bcc9c1;
          background: #fff;
          box-shadow:
            14px 14px 0
            var(--mint);
        }

        .price-report-header {
          min-height: 58px;
          display: flex;
          align-items:
            flex-start;
          justify-content:
            space-between;
          gap: 24px;
          padding-bottom:
            19px;
          border-bottom:
            1px solid
            #9eaea5;
        }

        .price-report-brand {
          display: flex;
          align-items:
            center;
          gap: 13px;
        }

        .price-report-brand > span {
          width: 39px;
          height: 39px;
          display: grid;
          place-items:
            center;
          border: 1px solid
            var(--green);
          color:
            var(--green);
          font-family:
            Georgia,
            serif;
          font-size: 18px;
        }

        .price-report-brand strong,
        .price-report-brand small {
          display: block;
        }

        .price-report-brand strong {
          font-size: 15px;
        }

        .price-report-brand small {
          margin-top: 4px;
          color: #768079;
          font-size: 10px;
        }

        .price-report-code {
          text-align: right;
        }

        .price-report-code strong,
        .price-report-code span {
          display: block;
        }

        .price-report-code strong {
          color:
            var(--green);
          font-size: 11px;
        }

        .price-report-code span {
          margin-top: 6px;
          color: #849089;
          font-family:
            ui-monospace,
            monospace;
          font-size: 9px;
        }

        .price-report-title {
          padding:
            62px 0 36px;
        }

        .price-report-title > p {
          margin: 0 0 17px;
          color:
            var(--green);
          font-size: 11px;
          font-weight: 900;
          letter-spacing:
            0.08em;
        }

        .price-report-title h1 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(
            38px,
            5vw,
            54px
          );
          line-height: 1.16;
          letter-spacing:
            -0.055em;
          word-break:
            keep-all;
        }

        .price-report-title > span {
          display: block;
          margin-top: 20px;
          color: #69736d;
          font-size: 12px;
          line-height: 1.7;
        }

        .judgment-box {
          padding: 28px 30px;
          background:
            var(--green);
          color: #fff;
        }

        .judgment-box p {
          margin: 0;
          color: #b9ddce;
          font-size: 10px;
          font-weight: 900;
        }

        .judgment-box strong {
          display: block;
          margin-top: 9px;
          font-size: 27px;
          letter-spacing:
            -0.04em;
        }

        .judgment-box span {
          display: block;
          max-width: 740px;
          margin-top: 13px;
          color: #d7ebe2;
          font-size: 13px;
          line-height: 1.75;
          word-break:
            keep-all;
        }

        .price-metrics {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              1fr
            );
          margin-top: 28px;
          border: solid
            #c8d2cc;
          border-width:
            1px 0 0 1px;
        }

        .price-metrics > div {
          min-height: 120px;
          padding: 23px 20px;
          border: solid
            #c8d2cc;
          border-width:
            0 1px 1px 0;
        }

        .price-metrics span,
        .price-metrics strong,
        .price-metrics small {
          display: block;
        }

        .price-metrics span {
          color: #77817b;
          font-size: 10px;
          font-weight: 800;
        }

        .price-metrics strong {
          margin-top: 15px;
          color:
            var(--green);
          font-size: 20px;
        }

        .price-metrics small {
          margin-top: 5px;
          color: #7c8580;
          font-size: 10px;
        }

        .report-section {
          margin-top: 62px;
        }

        .report-section-title {
          display: grid;
          grid-template-columns:
            58px 1fr;
          gap: 16px;
          align-items:
            start;
          margin-bottom: 23px;
        }

        .report-section-title > span {
          color:
            var(--green);
          font-family:
            Georgia,
            serif;
          font-size: 34px;
          font-style: italic;
        }

        .report-section-title p {
          margin: 2px 0 5px;
          color:
            var(--green);
          font-size: 9px;
          font-weight: 900;
        }

        .report-section-title h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing:
            -0.04em;
        }

        .evidence-list {
          border-top:
            1px solid
            var(--ink);
        }

        .evidence-list article {
          display: grid;
          grid-template-columns:
            1.1fr 0.8fr 1.8fr;
          gap: 20px;
          align-items:
            center;
          min-height: 92px;
          padding: 18px 10px;
          border-bottom:
            1px solid
            var(--line);
        }

        .evidence-list article > div {
          display: flex;
          align-items:
            center;
          gap: 12px;
        }

        .evidence-list article > div span {
          color:
            var(--green);
          font-family:
            Georgia,
            serif;
          font-size: 12px;
          font-style: italic;
        }

        .evidence-list article > div strong {
          font-size: 12px;
        }

        .evidence-list article > b {
          color:
            var(--green);
          font-size: 15px;
        }

        .evidence-list article > p {
          margin: 0;
          color: #69726d;
          font-size: 11px;
          line-height: 1.65;
        }

        .checkpoint-list {
          margin: 0;
          padding: 0;
          border-top:
            1px solid
            var(--ink);
          list-style: none;
        }

        .checkpoint-list li {
          display: grid;
          grid-template-columns:
            48px 1fr;
          align-items:
            center;
          min-height: 72px;
          border-bottom:
            1px solid
            var(--line);
        }

        .checkpoint-list span {
          color:
            var(--green);
          font-family:
            Georgia,
            serif;
          font-size: 13px;
          font-style: italic;
        }

        .checkpoint-list p {
          margin: 0;
          font-size: 13px;
          line-height: 1.65;
        }

        .limitation-list {
          margin: 0;
          padding: 22px 25px;
          background:
            #f3eee0;
          list-style: none;
        }

        .limitation-list li {
          position: relative;
          padding:
            7px 0 7px
            17px;
          color: #626b65;
          font-size: 11px;
          line-height: 1.65;
        }

        .limitation-list li::before {
          content: "·";
          position: absolute;
          left: 0;
          color:
            var(--green);
          font-weight: 900;
        }

        .price-report-footer {
          position: absolute;
          right: 58px;
          bottom: 34px;
          left: 58px;
          display: flex;
          justify-content:
            space-between;
          gap: 20px;
          padding-top: 14px;
          border-top:
            1px solid
            var(--line);
          color: #7d8681;
          font-size: 8px;
        }

        .report-controls {
          display: flex;
          justify-content:
            center;
          gap: 10px;
          margin-top: 34px;
        }

        .report-controls button {
          min-height: 50px;
          padding: 0 22px;
          border: 1px solid
            var(--ink);
          background:
            var(--ink);
          color: #fff;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .report-controls button.ghost {
          background: #fff;
          color:
            var(--ink);
        }

        @media (
          max-width: 680px
        ) {
          .price-report-wrap {
            width: min(
              100% - 32px,
              980px
            );
          }

          .price-report-page {
            min-height: auto;
            padding:
              28px 20px 36px;
            box-shadow:
              7px 7px 0
              var(--mint);
          }

          .price-report-header {
            gap: 10px;
          }

          .price-report-brand > span {
            width: 31px;
            height: 31px;
          }

          .price-report-brand strong {
            font-size: 12px;
          }

          .price-report-title {
            padding:
              42px 0 28px;
          }

          .price-report-title h1 {
            font-size: 32px;
          }

          .judgment-box {
            padding: 23px 20px;
          }

          .judgment-box strong {
            font-size: 23px;
          }

          .price-metrics {
            grid-template-columns:
              1fr;
          }

          .price-metrics > div {
            min-height: auto;
          }

          .evidence-list article {
            grid-template-columns:
              1fr;
            gap: 10px;
            padding: 18px 8px;
          }

          .report-section-title {
            grid-template-columns:
              44px 1fr;
          }

          .report-section-title > span {
            font-size: 28px;
          }

          .price-report-footer {
            position: static;
            margin-top: 44px;
            flex-direction:
              column;
            gap: 5px;
          }

          .report-controls {
            flex-direction:
              column;
          }

          .report-controls button {
            width: 100%;
          }
        }

        @media print {
        @page {
            size: A4;
            margin: 0;
        }

        .price-report-wrap {
            width: 100%;
            margin: 0;
        }

        .price-report-page {
            min-height: 0;
            padding:
            32px 42px 52px;
            border: 0;
            box-shadow: none;
        }

        .price-report-header {
            min-height: 44px;
            padding-bottom: 12px;
        }

        .price-report-brand > span {
            width: 32px;
            height: 32px;
            font-size: 15px;
        }

        .price-report-brand strong {
            font-size: 13px;
        }

        .price-report-brand small {
            font-size: 8px;
        }

        .price-report-title {
            padding:
            32px 0 22px;
        }

        .price-report-title > p {
            margin-bottom: 11px;
            font-size: 9px;
        }

        .price-report-title h1 {
            max-width: 720px;
            font-size: 36px;
            line-height: 1.15;
        }

        .price-report-title > span {
            margin-top: 12px;
            font-size: 10px;
        }

        .judgment-box {
            padding: 18px 22px;
        }

        .judgment-box p {
            font-size: 8px;
        }

        .judgment-box strong {
            margin-top: 6px;
            font-size: 22px;
        }

        .judgment-box span {
            margin-top: 8px;
            font-size: 10px;
            line-height: 1.55;
        }

        .price-metrics {
            margin-top: 16px;
        }

        .price-metrics > div {
            min-height: 82px;
            padding: 14px 15px;
        }

        .price-metrics span {
            font-size: 8px;
        }

        .price-metrics strong {
            margin-top: 9px;
            font-size: 16px;
        }

        .price-metrics small {
            margin-top: 3px;
            font-size: 8px;
        }

        .report-section {
            margin-top: 30px;
        }

        .report-section-title {
            grid-template-columns:
            46px 1fr;
            gap: 12px;
            margin-bottom: 12px;
        }

        .report-section-title > span {
            font-size: 27px;
        }

        .report-section-title p {
            margin-top: 1px;
            font-size: 8px;
        }

        .report-section-title h2 {
            font-size: 20px;
        }

        .evidence-list article {
            grid-template-columns:
            1.1fr 0.8fr 1.8fr;
            gap: 12px;
            min-height: 62px;
            padding: 9px 7px;
            break-inside: avoid;
            page-break-inside: avoid;
        }

        .evidence-list article > div {
            gap: 8px;
        }

        .evidence-list article > div span {
            font-size: 9px;
        }

        .evidence-list article > div strong {
            font-size: 9px;
        }

        .evidence-list article > b {
            font-size: 11px;
        }

        .evidence-list article > p {
            font-size: 8px;
            line-height: 1.5;
        }

        .print-page-two {
            margin-top: 0;
            padding-top: 40px;
            break-before: page;
            page-break-before: always;
        }

        .checkpoint-list li {
            min-height: 56px;
        }

        .checkpoint-list span {
            font-size: 10px;
        }

        .checkpoint-list p {
            font-size: 10px;
            line-height: 1.55;
        }

        .limitation-list {
            padding: 17px 20px;
        }

        .limitation-list li {
            padding-top: 5px;
            padding-bottom: 5px;
            font-size: 8px;
            line-height: 1.55;
        }

        .price-report-footer {
            right: 42px;
            bottom: 22px;
            left: 42px;
            font-size: 7px;
        }

        .report-controls {
            display: none;
        }
        }
      `}</style>
    </section>
  );
}