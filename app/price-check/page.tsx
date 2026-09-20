import type {
  Metadata,
} from "next";

import PriceCheckForm from "./price-check-form";

export const metadata: Metadata = {
  title:
    "매도 전 가격 진단 | 왜 안 팔릴까?",
  description:
    "최근 동일 면적 실거래와 단지 거래 흐름을 기준으로 아파트 희망가격의 현재 위치를 확인합니다.",
};

export default function PriceCheckPage() {
  return (
    <main>
      <nav
        className="nav-shell"
        aria-label="주요 메뉴"
      >
        <a
          className="brand"
          href="/"
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            ?
          </span>

          왜 안 팔릴까?
        </a>

        <a
          className="nav-link"
          href="/#pricing"
        >
          단계별 진단
        </a>
      </nav>

      <PriceCheckForm />

      <section className="sample-section">
        <div className="section-heading light">
          <p className="section-index">
            02 / 진단 기준
          </p>

          <h2>
            시세를 예측하지 않고,
            <br />
            현재 가격의 위치를
            확인합니다.
          </h2>
        </div>

        <div className="sample-steps">
          <div>
            <span>1</span>

            <strong>
              최근 동일 면적 실거래
            </strong>

            <p>
              같은 단지와 같은 전용면적의
              최근 실거래가격을
              확인합니다.
            </p>
          </div>

          <div>
            <span>2</span>

            <strong>
              단지 거래 흐름
            </strong>

            <p>
              최근 12개월 단지 거래량과
              동일 면적 거래 공백을 함께
              확인합니다.
            </p>
          </div>

          <div>
            <span>3</span>

            <strong>
              희망가격의 현재 위치
            </strong>

            <p>
              입력한 희망가격이 최근
              거래가격보다 어느 정도
              높은지 숫자로 정리합니다.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <a
          className="brand footer-brand"
          href="/"
        >
          <span
            className="brand-mark"
            aria-hidden="true"
          >
            ?
          </span>

          왜 안 팔릴까?
        </a>

        <p>
          국토교통부 실거래가
          자료를 기준으로 제공하는
          아파트 매도 진단 서비스입니다.
        </p>

        <div className="footer-links">
          <a href="/">
            메인
          </a>

          <a href="/#pricing">
            상품 안내
          </a>
        </div>
      </footer>
    </main>
  );
}