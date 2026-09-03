import Link from "next/link";

export const metadata = {
  title: "실거래가는 맞는데 왜 내 집만 안 팔릴까? | 왜 안 팔릴까",
  description:
    "최근 실거래가와 비슷하게 가격을 맞췄는데도 내 아파트만 안 팔린다면 동일 면적 거래 공백, 단지 거래량, 노출 기간, 문의·방문 반응과 개별 조건을 함께 확인해야 합니다.",
};

const reasons = [
  {
    number: "01",
    title: "실거래가가 같아도 거래 시점이 다를 수 있습니다.",
    description:
      "몇 달 전 체결가격과 현재 시장에서 받아들여지는 가격은 같지 않을 수 있습니다.",
    detail:
      "실거래가는 실제 체결된 가격이라는 점에서 중요한 기준이지만, 거래 시점 이후 시장 분위기나 경쟁 매물이 달라졌다면 같은 가격이라도 매수자의 반응은 달라질 수 있습니다. 따라서 가격 숫자뿐 아니라 마지막 거래 시점도 함께 확인해야 합니다.",
    check:
      "비교하는 실거래가가 언제 체결됐는지, 이후 동일·유사 거래가 있었는지 확인합니다.",
    signal: "가격",
  },
  {
    number: "02",
    title: "단지 전체 실거래와 내 평형의 시장은 다를 수 있습니다.",
    description:
      "같은 단지라도 면적별로 수요와 거래 빈도가 다르게 나타날 수 있습니다.",
    detail:
      "단지에서 최근 거래가 있었다고 해도 내가 보유한 면적의 마지막 거래가 오래전이라면 해당 평형을 찾는 매수자의 수가 적을 수 있습니다. 단지 평균 분위기만으로 개별 평형의 유동성을 판단하기 어려운 이유입니다.",
    check:
      "동일 면적의 마지막 거래일과 최근 거래 건수를 별도로 확인합니다.",
    signal: "유동성",
  },
  {
    number: "03",
    title: "가격은 비슷하지만 경쟁 매물의 조건이 더 좋을 수 있습니다.",
    description:
      "매수자는 가격만 비교하지 않습니다.",
    detail:
      "같은 가격대의 매물이라도 층, 방향, 내부 수리 상태, 입주 가능 시점, 세입자 여부 등에서 차이가 나면 매수자의 선택이 달라질 수 있습니다. 실거래가에 가격을 맞췄다는 사실만으로 현재 경쟁력이 동일하다고 볼 수는 없습니다.",
    check:
      "현재 같은 단지에서 경쟁 중인 유사 매물의 가격과 개별 조건을 함께 비교합니다.",
    signal: "조건",
  },
  {
    number: "04",
    title: "단지 전체 거래 속도가 느릴 수 있습니다.",
    description:
      "적정 가격이어도 매수 후보 자체가 적으면 거래에는 시간이 필요합니다.",
    detail:
      "최근 6개월~12개월 동안 단지 거래 건수가 적다면 개별 매물의 가격과 무관하게 거래가 성사되는 빈도 자체가 낮을 수 있습니다. 이런 경우 '가격을 맞췄는데도 안 팔린다'는 현상이 여러 매물에서 동시에 나타날 수 있습니다.",
    check:
      "단지 규모와 최근 12개월 실거래 건수를 함께 확인합니다.",
    signal: "유동성",
  },
  {
    number: "05",
    title: "문의가 발생하는지 여부가 중요한 추가 신호입니다.",
    description:
      "같은 가격이라도 문의 반응에 따라 원인 해석이 달라집니다.",
    detail:
      "문의 자체가 거의 없다면 검색·비교 단계에서 가격 또는 노출 경쟁력이 약할 가능성을 살펴볼 수 있습니다. 반대로 문의는 있는데 방문이나 협상으로 이어지지 않는다면 가격 외 조건이나 전환 단계의 문제를 확인해야 합니다.",
    check:
      "등록기간 대비 문의 횟수와 방문 횟수를 분리해서 확인합니다.",
    signal: "전환",
  },
];

const comparisonRows = [
  {
    situation: "최근 실거래와 희망가가 비슷하지만 문의가 없음",
    firstCheck: "거래 시점 · 경쟁 매물",
    interpretation:
      "실거래 숫자만 아니라 현재 시장에서의 상대적 가격 경쟁력을 확인합니다.",
  },
  {
    situation: "단지는 거래되지만 동일 면적 거래가 없음",
    firstCheck: "동일 면적 유동성",
    interpretation:
      "단지 전체보다 해당 평형의 수요 부족 가능성을 먼저 봅니다.",
  },
  {
    situation: "동일 가격대 매물은 있는데 내 매물만 반응이 적음",
    firstCheck: "개별 조건 · 노출",
    interpretation:
      "층, 방향, 내부 상태, 입주 조건 등 상대적 차이를 확인합니다.",
  },
  {
    situation: "단지 전체 매물이 오래 걸리는 편",
    firstCheck: "단지 거래량",
    interpretation:
      "개별 매물보다 시장 자체의 거래 속도가 느린 상황일 수 있습니다.",
  },
  {
    situation: "문의는 있으나 방문이나 협상이 적음",
    firstCheck: "전환 · 조건",
    interpretation:
      "가격은 관심을 끌지만 이후 비교 단계에서 이탈하는 원인을 봅니다.",
  },
];

export default function MarketPriceButNotSellingGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#171717]">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-black/15 pb-10">
          <p className="mb-4 text-sm font-semibold tracking-[0.08em] text-[#6b675f]">
            아파트 매도 정체 가이드
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.25] tracking-[-0.035em] sm:text-5xl">
            실거래가는 맞췄는데
            <br className="hidden sm:block" /> 왜 내 집만 안 팔릴까요?
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#55514b] sm:text-lg">
            최근 실거래가와 비슷한 가격으로 매물을 내놓았는데도 반응이 없으면
            가격이 아닌 다른 원인을 의심하게 됩니다. 이때는 실거래 가격
            자체뿐 아니라 거래 시점, 동일 면적 거래 빈도, 단지 거래량,
            경쟁 매물과의 조건 차이, 실제 문의 반응을 함께 확인해야 합니다.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm font-semibold text-[#2b2925]">
              실거래가는 기준점이지 현재 매도의 정답 가격은 아닙니다.
            </p>

            <p className="mt-2 text-sm leading-7 text-[#666159]">
              같은 단지의 같은 가격이라도 거래 시점과 면적, 매물 조건,
              현재 시장의 매수 수요에 따라 실제 반응은 달라질 수 있습니다.
            </p>
          </div>
        </header>

        <section className="py-12">
          <p className="text-sm font-semibold text-[#777168]">
            실거래가만으로 판단하기 어려운 이유
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            같은 가격이라도 시장에서의 위치는 다를 수 있습니다.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">가격은 비슷함</p>
              <p className="mt-2 text-lg font-bold">거래 시점</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                과거 체결가와 현재 시장가격 사이의 시간 차이를 확인합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">단지는 거래됨</p>
              <p className="mt-2 text-lg font-bold">면적별 유동성</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                내 평형을 찾는 수요가 실제로 있는지 봅니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">가격도 비슷함</p>
              <p className="mt-2 text-lg font-bold">조건 · 반응</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                경쟁 매물 대비 개별 조건과 문의 반응을 확인합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            실거래가와 비슷한데도 안 팔릴 때
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            확인해야 할 5가지
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
            같은 가격인데도 결과가 다른 이유
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            실제 반응과 거래 구조를 함께 봅니다.
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
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
                  {comparisonRows.map((row) => (
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
              실거래가에 맞췄는데도 반응이 없다면
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em]">
              가격 외의 신호가 같은 방향을 가리키는지 확인해보세요.
            </h2>

            <p className="mt-5 leading-8 text-[#5f5a53]">
              최근 실거래와 희망가가 비슷하다는 사실은 중요한 출발점입니다.
              하지만 동일 면적 거래가 장기간 없거나 단지 전체 거래가 적고,
              문의 반응까지 약하다면 현재 매도 정체를 가격 하나만으로
              설명하기 어려울 수 있습니다. 여러 신호의 조합을 보고 원인의
              범위를 좁히는 것이 중요합니다.
            </p>
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-xl font-bold">
            실거래 데이터에도 해석이 필요한 이유가 있습니다.
          </h2>

          <p className="mt-4 leading-8 text-[#5f5a53]">
            실거래에는 층, 방향, 내부 상태, 거래 당시의 개별 협상조건 등
            현재 매물과 완전히 동일하지 않은 요소가 포함될 수 있습니다.
            따라서 단일 거래가격을 현재 매물의 절대적인 적정가격으로 보기보다
            여러 거래와 시장 반응을 함께 참고하는 것이 적절합니다.
          </p>
        </section>

        <section className="border-t border-black/15 pt-12">
          <div className="rounded-3xl border border-black bg-[#f4f1e8] p-7 sm:p-10">
            <p className="text-sm font-semibold text-[#777168]">
              가격은 맞는 것 같은데 왜 안 팔릴까요?
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.35] tracking-[-0.025em] sm:text-3xl">
              실거래 가격뿐 아니라
              <br className="hidden sm:block" />
              거래 흐름과 실제 매물 반응을 함께 확인합니다.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#5f5a53]">
              최근 실거래, 동일 면적 거래 공백, 단지 거래량, 등록 기간,
              문의·방문 반응을 바탕으로 현재 매도 정체의 가능성이 높은
              원인을 분석합니다.
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
              특정 가격이나 거래 성사 여부를 보장하지 않습니다.
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