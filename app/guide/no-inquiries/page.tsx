import Link from "next/link";

export const metadata = {
  title: "아파트 매도 문의가 없는 이유 | 왜 안 팔릴까",
  description:
    "아파트 매물을 등록했는데 문의가 거의 없다면 가격, 노출, 거래 유동성, 매물 조건을 구분해서 확인해야 합니다.",
};

const reasons = [
  {
    number: "01",
    title: "검색 단계에서 가격 경쟁력이 부족할 수 있습니다.",
    description:
      "문의가 없다는 것은 실제 방문 이전의 비교 단계에서 선택되지 않고 있을 가능성이 있다는 뜻입니다.",
    detail:
      "매수자는 같은 단지와 주변의 유사 매물을 동시에 비교합니다. 최근 동일·유사 면적 실거래보다 희망가격이 높거나 경쟁 매물보다 조건이 약하면 문의가 발생하기 전에 후보에서 제외될 수 있습니다.",
    check:
      "최근 동일·유사 면적 실거래와 현재 희망가의 차이를 확인합니다.",
    signal: "가격",
  },
  {
    number: "02",
    title: "매물이 충분히 노출되지 않고 있을 수 있습니다.",
    description:
      "가격이 적정하더라도 매수자가 매물을 제대로 발견하지 못하면 문의가 발생하기 어렵습니다.",
    detail:
      "중개업소 등록 범위, 사진과 설명, 매물 정보의 완성도, 검색 조건에서의 노출 여부 등에 따라 같은 가격의 매물이라도 관심을 받는 정도가 달라질 수 있습니다.",
    check:
      "매물 등록 기간과 중개업소 노출 범위, 매물 정보 상태를 함께 확인합니다.",
    signal: "노출",
  },
  {
    number: "03",
    title: "단지 자체의 거래 유동성이 낮을 수 있습니다.",
    description:
      "개별 매물의 문제가 아니라 단지 전체에서 거래가 잘 발생하지 않는 시기일 수도 있습니다.",
    detail:
      "최근 수개월 동안 단지 전체 거래가 적다면 매수 후보가 시장에 들어오는 빈도도 낮을 수 있습니다. 이 경우 문의가 없는 것을 곧바로 가격 문제라고 단정하기 어렵습니다.",
    check:
      "최근 6개월~12개월 단지 전체 거래 건수와 단지 규모를 확인합니다.",
    signal: "유동성",
  },
  {
    number: "04",
    title: "해당 면적의 수요가 약할 수 있습니다.",
    description:
      "단지 전체에서 거래가 있어도 특정 평형의 거래가 오래 없을 수 있습니다.",
    detail:
      "매수 수요는 면적별로 다르게 나타날 수 있습니다. 동일 면적의 최근 거래 공백이 길다면 현재 가격과 별개로 해당 평형 자체의 거래 빈도가 낮은지 살펴볼 필요가 있습니다.",
    check:
      "동일 면적의 마지막 거래 시점과 최근 거래 건수를 확인합니다.",
    signal: "유동성",
  },
  {
    number: "05",
    title: "매물 조건이 검색 단계에서 약하게 보일 수 있습니다.",
    description:
      "층, 방향, 내부 상태, 입주 조건 등도 매수자의 초기 선택에 영향을 줄 수 있습니다.",
    detail:
      "실거래 데이터상 가격이 비슷하더라도 개별 매물의 층, 향, 수리 상태, 세입자 여부, 입주 가능 시점 등에 따라 매수자의 관심도가 달라질 수 있습니다.",
    check:
      "가격 외 조건이 경쟁 매물과 비교해 어떤 위치인지 확인합니다.",
    signal: "조건",
  },
];

const reactionRows = [
  {
    situation: "등록한 지 얼마 안 됨",
    firstCheck: "노출 기간",
    interpretation:
      "아직 시장 반응을 판단하기 이른 단계일 수 있습니다.",
  },
  {
    situation: "오래 등록했지만 문의 0~1회",
    firstCheck: "가격 · 노출",
    interpretation:
      "검색과 비교 단계에서 선택되지 않는 이유를 먼저 봅니다.",
  },
  {
    situation: "단지 전체 거래도 거의 없음",
    firstCheck: "유동성",
    interpretation:
      "특정 매물보다 단지 전체의 매수 수요가 약할 가능성이 있습니다.",
  },
  {
    situation: "비슷한 매물은 거래되는데 내 매물만 문의 없음",
    firstCheck: "가격 · 조건",
    interpretation:
      "경쟁 매물과 비교했을 때 현재 매물의 상대적 위치를 확인합니다.",
  },
];

export default function NoInquiriesGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#171717]">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-black/15 pb-10">
          <p className="mb-4 text-sm font-semibold tracking-[0.08em] text-[#6b675f]">
            아파트 매도 정체 가이드
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.25] tracking-[-0.035em] sm:text-5xl">
            아파트를 내놨는데
            <br className="hidden sm:block" /> 왜 문의조차 없을까요?
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#55514b] sm:text-lg">
            매물을 등록했는데 전화나 방문 문의가 거의 없다면 실제 거래보다
            앞선 단계에서 막혀 있을 가능성이 있습니다. 가격, 노출, 단지
            거래량, 동일 면적의 거래 빈도와 개별 매물 조건을 구분해서
            확인해야 합니다.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm font-semibold text-[#2b2925]">
              “거래가 안 된다”와 “문의가 없다”는 같은 문제가 아닙니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#666159]">
              문의가 없다면 매수자가 방문이나 협상을 고민하기 전에 이미
              검색·비교 단계에서 이탈하고 있을 가능성을 먼저 살펴볼 수 있습니다.
            </p>
          </div>
        </header>

        <section className="py-12">
          <p className="text-sm font-semibold text-[#777168]">
            문의가 없는 상태를 해석하려면
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            먼저 매수자가 어디까지 왔는지를 봐야 합니다.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">검색에서 선택 안 됨</p>
              <p className="mt-2 text-lg font-bold">가격 · 노출</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                후보 매물로 들어오지 못하는 원인을 확인합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">매수자 자체가 적음</p>
              <p className="mt-2 text-lg font-bold">유동성</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                단지나 해당 면적의 거래 빈도를 확인합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">경쟁 매물에 밀림</p>
              <p className="mt-2 text-lg font-bold">조건</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                가격 외 개별 조건이 비교에서 약한지 살펴봅니다.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            문의가 없을 때 확인할 항목
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            가장 먼저 확인할 5가지
          </h2>

          <div className="mt-8 space-y-5">
            {reasons.map((item) => (
              <section
                key={item.number}
                className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8"
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="shrink-0 text-sm font-bold text-[#8a8379]">
                    {item.number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                        {item.title}
                      </h3>

                      <span className="rounded-full bg-[#efede6] px-3 py-1 text-xs font-semibold text-[#5e5951]">
                        {item.signal}
                      </span>
                    </div>

                    <p className="mt-3 font-medium leading-7 text-[#36332e]">
                      {item.description}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-[#69645d] sm:text-base">
                      {item.detail}
                    </p>

                    <div className="mt-5 border-l-2 border-black/20 pl-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8a8379]">
                        확인 포인트
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#45413c]">
                        {item.check}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            등록기간과 시장반응을 함께 봅니다
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            문의가 없다는 사실만으로 가격 문제라고 단정하지 않습니다.
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-[#efede6]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">
                      현재 상황
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      먼저 확인할 항목
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      해석
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reactionRows.map((row) => (
                    <tr
                      key={row.situation}
                      className="border-t border-black/10 align-top"
                    >
                      <td className="px-5 py-4 text-sm font-medium leading-6">
                        {row.situation}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold leading-6">
                        {row.firstCheck}
                      </td>
                      <td className="px-5 py-4 text-sm leading-6 text-[#666159]">
                        {row.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-t border-black/15 py-12">
          <div className="rounded-3xl bg-[#ebe7dc] p-7 sm:p-9">
            <p className="text-sm font-semibold text-[#777168]">
              문의가 없다고 바로 가격을 내리기 전에
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em]">
              가격 문제인지, 시장 자체가 느린지 먼저 구분해보세요.
            </h2>

            <p className="mt-5 leading-8 text-[#5f5a53]">
              가격 조정은 되돌리기 어려운 의사결정일 수 있습니다. 최근
              실거래와 단지 거래 흐름, 동일 면적 거래 공백, 현재까지의
              노출기간과 문의 반응을 함께 보면 단순 가격 조정 외에 무엇을
              먼저 확인해야 하는지 좁힐 수 있습니다.
            </p>
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-xl font-bold">
            공개 데이터만으로 설명하기 어려운 요인도 있습니다.
          </h2>

          <p className="mt-4 leading-8 text-[#5f5a53]">
            매물 사진, 중개업소의 설명 방식, 층과 방향, 내부 수리 상태,
            세입자 여부, 입주 가능 시점, 경쟁 매물의 개별 조건 등은
            공개 실거래 데이터만으로 모두 확인할 수 없습니다. 따라서 데이터는
            현재 매도 정체의 원인을 좁히는 기준으로 활용하는 것이 적절합니다.
          </p>
        </section>

        <section className="border-t border-black/15 pt-12">
          <div className="rounded-3xl border border-black bg-[#f4f1e8] p-7 sm:p-10">
            <p className="text-sm font-semibold text-[#777168]">
              왜 문의가 없는지 숫자로 확인해보세요.
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.35] tracking-[-0.025em] sm:text-3xl">
              최근 실거래와 거래 흐름,
              <br className="hidden sm:block" />
              현재 매물 반응을 함께 분석합니다.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#5f5a53]">
              최근 실거래, 동일 면적 거래 공백, 단지 거래량, 등록 기간,
              문의·방문 반응을 바탕으로 현재 매도가 어느 단계에서 막혀 있을
              가능성이 높은지 확인합니다.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-semibold"
              style={{ color: "#ffffff" }}
            >
              내 아파트 진단하기
            </Link>

            <p className="mt-4 text-xs leading-5 text-[#777168]">
              분석 결과는 매도 의사결정을 돕기 위한 참고자료이며,
              매매가격이나 거래 성사 여부를 보장하지 않습니다.
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t border-black/10 pt-6 text-sm text-[#777168]">
          왜 안 팔릴까 · 아파트 매도 정체 진단
        </footer>
      </article>
    </main>
  );
}