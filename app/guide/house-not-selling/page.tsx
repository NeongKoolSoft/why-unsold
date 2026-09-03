export const metadata = {
  title: "집이 안 팔릴 때 확인할 5가지 | 왜 안 팔릴까",
  description:
    "아파트 매물이 오래 안 팔릴 때 확인해야 할 실거래가, 거래량, 등록 기간, 문의 반응 등 핵심 지표를 정리합니다.",
};

export default function HouseNotSellingGuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-medium text-neutral-500">
            아파트 매도 가이드
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            집이 안 팔릴 때 가장 먼저 확인할 5가지
          </h1>

          <p className="text-lg leading-8 text-neutral-600">
            집이 오래 안 팔린다고 해서 원인이 항상 가격인 것은 아닙니다.
            최근 실거래, 단지 거래량, 동일 면적 거래 여부, 등록 기간,
            문의 반응을 함께 확인해야 원인을 좁힐 수 있습니다.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            1. 최근 실거래가와 희망가 차이
          </h2>
          <p className="leading-7 text-neutral-700">
            최근 같은 단지와 비슷한 면적의 실제 거래가격과 현재 희망가격의
            차이를 먼저 확인해보세요. 가격 차이가 크다면 매수자가 비교 단계에서
            바로 이탈할 가능성이 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            2. 같은 면적의 최근 거래 여부
          </h2>
          <p className="leading-7 text-neutral-700">
            단지 전체 거래가 있더라도 내가 보유한 면적의 거래가 오래 없었다면
            해당 평형 자체의 유동성이 낮을 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            3. 단지 전체 거래량
          </h2>
          <p className="leading-7 text-neutral-700">
            최근 6개월~1년 동안 단지에서 실제 거래가 얼마나 있었는지도
            중요합니다. 거래 자체가 적은 단지라면 매도기간이 길어질 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            4. 매물을 올린 기간
          </h2>
          <p className="leading-7 text-neutral-700">
            등록한 지 얼마 되지 않았다면 아직 반응을 판단하기 이를 수 있습니다.
            반대로 충분한 기간이 지났는데도 문의가 없다면 가격이나 노출 조건을
            다시 점검할 필요가 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">
            5. 문의와 방문 반응
          </h2>
          <p className="leading-7 text-neutral-700">
            문의 자체가 없다면 가격이나 노출 문제가 먼저 의심되고, 문의는
            많은데 방문으로 이어지지 않는다면 매물 설명이나 조건을 점검할 수
            있습니다.
          </p>
        </section>

        <section className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold">
            내 아파트는 왜 안 팔리고 있을까요?
          </h2>

          <p className="mt-3 leading-7 text-neutral-600">
            최근 실거래와 거래 흐름, 매물 반응을 바탕으로 현재 매도 정체의
            가능성이 높은 원인을 확인해보세요.
          </p>

          <a
            href="/"
            className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 font-medium !text-white"
            >
            내 아파트 진단하기
          </a>
        </section>
      </article>
    </main>
  );
}