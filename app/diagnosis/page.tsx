import DiagnosisForm from "../diagnosis-form";

const businessInfo = {
  businessName: "넝쿨웍스",
  representative: "박경은",
  registrationNumber: "865-27-02154",
  address:
    "부산광역시 부산진구 부전로96번길 7, 401-S229호(부전동)",
  phone: "010-3316-9786",
  mailOrderNumber: "2026-부산진구-1211",
};

export default function DiagnosisPage() {
  return (
    <main>
      <nav
        className="nav-shell"
        aria-label="매도 정체 진단 메뉴"
      >
        <a
          className="brand"
          href="/"
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
          href="/#products"
        >
          상품 선택
        </a>

        <span className="nav-link">
          매도 정체 진단
        </span>
      </nav>

      <section
        className="application-section"
        id="application"
        aria-label="매도 정체 진단 신청서"
      >
        <DiagnosisForm />
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

          <span>왜 안 팔릴까?</span>
        </a>

        <p>
          매도 중 정체 원인을 실거래와 사용자 입력을
          바탕으로 분석합니다.
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

          <span>
            통신판매업 신고번호{" "}
            {businessInfo.mailOrderNumber}
          </span>
        </div>
      </footer>
    </main>
  );
}
