import Link from "next/link";

export const metadata = {
  title: "집이 안 팔릴 때 확인해야 할 5가지 | 왜 안 팔릴까",
  description:
    "아파트 매물이 오래 안 팔릴 때 가격만 낮추기 전에 확인해야 할 실거래가 차이, 동일 면적 거래 공백, 단지 거래량, 등록 기간, 문의·방문 반응을 정리합니다.",
};

const diagnosisSignals = [
  {
    number: "01",
    title: "최근 실거래 대비 희망가 차이",
    description:
      "현재 희망가격이 최근 동일·유사 면적 실거래와 얼마나 차이가 나는지 확인합니다.",
    detail:
      "매수자는 하나의 매물만 보는 것이 아니라 같은 단지와 주변 매물을 함께 비교합니다. 최근 거래가격보다 희망가격이 높다면, 실제 문의가 발생하기 전에 비교 단계에서 제외될 가능성이 있습니다.",
    check: "최근 동일·유사 면적 실거래가와 현재 희망가의 차이를 확인합니다.",
    signal: "가격",
  },
  {
    number: "02",
    title: "동일 면적의 거래 공백",
    description:
      "단지 전체 거래가 아니라 내가 보유한 면적이 실제로 얼마나 자주 거래되는지 확인합니다.",
    detail:
      "단지 전체에서는 거래가 발생하고 있어도 특정 면적의 거래가 장기간 없다면 해당 평형의 유동성이 낮을 수 있습니다. 이 경우 단순한 가격 조정만으로 해결되지 않을 가능성도 있습니다.",
    check: "동일 면적의 마지막 거래 시점과 거래 공백 기간을 확인합니다.",
    signal: "유동성",
  },
  {
    number: "03",
    title: "단지 전체 거래량",
    description:
      "최근 일정 기간 동안 단지 전체에서 실제 거래가 얼마나 발생했는지 봅니다.",
    detail:
      "거래 자체가 적은 단지는 매수 후보가 나타나는 빈도도 낮을 수 있습니다. 매물이 오래 남아 있다고 해서 반드시 개별 매물에 문제가 있다고 볼 수 없는 이유입니다.",
    check: "최근 12개월 단지 전체 거래 건수와 단지 규모를 함께 확인합니다.",
    signal: "유동성",
  },
  {
    number: "04",
    title: "매물 등록 기간",
    description:
      "현재 매물이 시장에 노출된 기간이 충분했는지 확인합니다.",
    detail:
      "등록한 지 얼마 되지 않은 매물과 장기간 노출됐지만 반응이 없는 매물은 같은 방식으로 판단하기 어렵습니다. 노출기간이 길수록 이후의 문의·방문 반응을 함께 봐야 합니다.",
    check: "등록 시점부터 현재까지의 노출기간을 확인합니다.",
    signal: "노출",
  },
  {
    number: "05",
    title: "문의와 방문 반응",
    description:
      "문의 자체가 없는지, 문의는 있지만 방문으로 이어지지 않는지를 구분합니다.",
    detail:
      "문의가 거의 없다면 가격이나 노출 단계에서 막혀 있을 가능성을 먼저 살펴볼 수 있습니다. 반대로 문의는 발생하지만 방문이나 후속 반응이 없다면 매물 조건이나 전환 단계의 문제일 수 있습니다.",
    check: "문의 횟수와 실제 방문 횟수를 분리해서 확인합니다.",
    signal: "전환",
  },
];

const signalRows = [
  {
    observation: "최근 실거래보다 희망가가 높음",
    cause: "가격",
    meaning: "매수자의 비교 단계에서 제외될 가능성",
  },
  {
    observation: "동일 면적 거래가 장기간 없음",
    cause: "유동성",
    meaning: "해당 평형 자체의 거래 빈도가 낮을 가능성",
  },
  {
    observation: "단지 전체 거래량이 적음",
    cause: "유동성",
    meaning: "매수 수요 자체가 드문 시장일 가능성",
  },
  {
    observation: "등록기간이 긴데 문의가 거의 없음",
    cause: "가격 · 노출",
    meaning: "검색·비교 단계에서 관심을 얻지 못할 가능성",
  },
  {
    observation: "문의는 있지만 방문이 적음",
    cause: "전환 · 조건",
    meaning: "매물 조건이나 설명 단계에서 이탈할 가능성",
  },
];

export default function HouseNotSellingGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#171717]">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Hero */}
        <header className="border-b border-black/15 pb-10">
          <p className="mb-4 text-sm font-semibold tracking-[0.08em] text-[#6b675f]">
            아파트 매도 정체 가이드
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.25] tracking-[-0.035em] sm:text-5xl">
            집이 안 팔릴 때,
            <br className="hidden sm:block" /> 가격부터 내리기 전에 확인할 5가지
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#55514b] sm:text-lg">
            아파트 매물이 오래 팔리지 않는 이유를 단순히 “가격이 비싸서”라고
            결론 내리기는 어렵습니다. 최근 실거래, 동일 면적의 거래 공백,
            단지 거래량, 매물 등록 기간, 문의·방문 반응을 함께 봐야 현재
            매도가 어느 단계에서 막혀 있는지 좁혀볼 수 있습니다.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm font-semibold text-[#2b2925]">
              핵심은 가격 하나가 아니라 여러 신호의 조합입니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#666159]">
              같은 “안 팔리는 집”이라도 가격 문제, 거래 유동성 문제, 노출
              문제, 문의 이후의 전환 문제는 대응 방법이 서로 다를 수 있습니다.
            </p>
          </div>
        </header>

        {/* Why */}
        <section className="py-12">
          <p className="text-sm font-semibold text-[#777168]">
            먼저 구분해야 할 것
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            “안 팔린다”는 결과는 같아도 원인은 다를 수 있습니다.
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm font-semibold text-[#777168]">
                문의 자체가 거의 없다면
              </p>
              <p className="mt-3 text-xl font-bold">
                가격 · 노출 단계
              </p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                매수자가 검색 결과나 비교 단계에서 매물을 선택하지 않는
                상황인지 먼저 살펴볼 필요가 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm font-semibold text-[#777168]">
                문의는 있지만 거래가 안 된다면
              </p>
              <p className="mt-3 text-xl font-bold">
                조건 · 전환 단계
              </p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                가격 외에 층, 방향, 수리 상태, 방문 이후의 비교 조건 등이
                영향을 주고 있는지 살펴볼 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Five Signals */}
        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            매도 정체를 볼 때 사용하는 주요 신호
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            가장 먼저 확인할 5가지
          </h2>

          <div className="mt-8 space-y-5">
            {diagnosisSignals.map((item) => (
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

        {/* Diagnostic logic */}
        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            신호를 이렇게 구분합니다
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            숫자를 하나씩 보는 것보다 조합해서 보는 것이 중요합니다.
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-[#5f5a53]">
            하나의 지표만으로 매도 정체 원인을 단정하기는 어렵습니다.
            여러 지표가 같은 방향을 가리키는지를 함께 확인하면 현재
            매물이 어느 단계에서 막혀 있을 가능성이 높은지 보다 구체적으로
            좁힐 수 있습니다.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <thead className="bg-[#efede6]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">
                      관찰되는 신호
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      우선 확인할 원인
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      해석
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {signalRows.map((row) => (
                    <tr
                      key={row.observation}
                      className="border-t border-black/10 align-top"
                    >
                      <td className="px-5 py-4 text-sm font-medium leading-6">
                        {row.observation}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold leading-6">
                        {row.cause}
                      </td>
                      <td className="px-5 py-4 text-sm leading-6 text-[#666159]">
                        {row.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Caution */}
        <section className="border-t border-black/15 py-12">
          <div className="rounded-2xl bg-[#ebe7dc] p-6 sm:p-8">
            <h2 className="text-xl font-bold">
              숫자만으로 모든 매도 상황을 설명할 수는 없습니다.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#5f5a53] sm:text-base">
              층, 방향, 내부 상태, 세입자 여부, 중개 방식, 주변 신규 공급,
              개별 매수자의 선호 등 공개 데이터만으로 확인하기 어려운 요인도
              존재합니다. 따라서 데이터는 매도 정체의 가능성이 높은 원인을
              좁히는 참고자료로 활용하는 것이 적절합니다.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-6">
          <div className="rounded-3xl border border-black bg-[#f4f1e8] p-7 sm:p-10">
            <p className="text-sm font-semibold text-[#777168]">
              내 매물은 어느 단계에서 막혀 있을까요?
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.35] tracking-[-0.025em] sm:text-3xl">
              실거래와 거래 흐름,
              <br className="hidden sm:block" />
              실제 매물 반응을 함께 확인해보세요.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#5f5a53]">
              최근 실거래, 동일 면적 거래, 단지 거래량, 등록 기간,
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
              매매가격이나 거래 성사 여부를 보장하지 않습니다.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-black/10 pt-6 text-sm text-[#777168]">
          왜 안 팔릴까 · 아파트 매도 정체 진단
        </footer>
      </article>
    </main>
  );
}