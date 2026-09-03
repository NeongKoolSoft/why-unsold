import Link from "next/link";

export const metadata = {
  title: "급매로 내놨는데도 안 팔리는 이유 | 왜 안 팔릴까",
  description:
    "아파트를 급매 수준으로 내놓았는데도 문의나 거래가 없다면 가격 외에 거래 유동성, 동일 면적 거래 공백, 노출과 매물 조건을 함께 확인해야 합니다.",
};

const reasons = [
  {
    number: "01",
    title: "급매라고 생각한 가격이 시장에서는 급매가 아닐 수 있습니다.",
    description:
      "매도자가 생각하는 할인폭과 실제 매수자가 비교하는 기준은 다를 수 있습니다.",
    detail:
      "매수자는 최초 매입가격이나 주변 중개업소의 평가보다 최근 동일·유사 면적 실거래와 현재 시장에 나온 다른 매물을 함께 비교합니다. 호가를 낮췄더라도 최근 체결가격과의 차이가 남아 있다면 매수자에게는 여전히 가격 매력이 부족하게 보일 수 있습니다.",
    check:
      "최근 동일·유사 면적 실거래가 대비 현재 희망가의 차이를 확인합니다.",
    signal: "가격",
  },
  {
    number: "02",
    title: "가격보다 거래 자체가 드문 평형일 수 있습니다.",
    description:
      "가격을 낮춰도 해당 면적을 찾는 매수자가 적으면 거래까지 시간이 걸릴 수 있습니다.",
    detail:
      "단지 전체 거래가 활발해 보여도 특정 면적의 마지막 거래가 오래전이라면 해당 평형의 유동성이 낮을 수 있습니다. 이 경우 급매 여부만으로 거래 가능성을 판단하기 어렵습니다.",
    check:
      "동일 면적의 마지막 거래 시점과 최근 거래 건수를 확인합니다.",
    signal: "유동성",
  },
  {
    number: "03",
    title: "단지 전체의 매수 수요가 약한 시기일 수 있습니다.",
    description:
      "개별 매물 가격이 아니라 단지 전체 거래 속도가 느려진 경우도 있습니다.",
    detail:
      "최근 수개월 동안 단지 전체에서 거래가 거의 없다면 특정 매물만의 문제가 아닐 수 있습니다. 매수 후보가 시장에 들어오는 빈도 자체가 낮다면 가격을 낮춰도 반응이 즉시 나타나지 않을 수 있습니다.",
    check:
      "최근 6개월~12개월 단지 전체 거래량과 단지 규모를 함께 봅니다.",
    signal: "유동성",
  },
  {
    number: "04",
    title: "검색 단계에서 매물이 충분히 선택되지 않을 수 있습니다.",
    description:
      "가격은 낮아졌지만 매수자에게 제대로 노출되지 않는 상황도 구분해야 합니다.",
    detail:
      "등록한 중개업소 수, 매물 사진과 설명, 층·방향·입주 조건 등 비교 화면에서 보이는 정보가 약하면 가격 경쟁력이 있어도 실제 문의로 이어지지 않을 수 있습니다.",
    check:
      "등록 기간과 문의 횟수를 함께 보고 노출 대비 실제 반응을 확인합니다.",
    signal: "노출",
  },
  {
    number: "05",
    title: "문의는 있는데 방문·협상으로 이어지지 않을 수 있습니다.",
    description:
      "문의가 발생한다면 문제는 가격 이전 단계가 아닐 가능성도 있습니다.",
    detail:
      "광고나 가격을 보고 문의까지 들어왔지만 실제 방문이나 후속 협상으로 이어지지 않는다면 층, 방향, 내부 상태, 입주 가능 시점 등 개별 조건이 비교 과정에서 영향을 주고 있을 수 있습니다.",
    check:
      "문의 수와 방문 수를 분리해 어느 단계에서 반응이 끊기는지 확인합니다.",
    signal: "전환",
  },
];

const cases = [
  {
    situation: "가격을 여러 번 낮췄는데 문의가 거의 없음",
    firstCheck: "실거래 대비 가격 · 노출",
    interpretation:
      "가격을 낮췄다는 사실보다 현재 시장가격과 실제 차이가 있는지가 중요합니다.",
  },
  {
    situation: "단지는 거래되는데 내 평형만 거래가 없음",
    firstCheck: "동일 면적 거래 공백",
    interpretation:
      "개별 가격보다 해당 평형의 유동성 문제일 가능성을 먼저 살펴봅니다.",
  },
  {
    situation: "단지 전체 거래가 거의 없음",
    firstCheck: "단지 유동성",
    interpretation:
      "특정 매물보다 시장 자체의 매수 수요가 약한 상황일 수 있습니다.",
  },
  {
    situation: "문의는 들어오는데 방문이 적음",
    firstCheck: "매물 조건 · 전환",
    interpretation:
      "가격 이외의 조건이 실제 비교 단계에서 영향을 주는지 확인합니다.",
  },
];

export default function UrgentSaleNotSellingPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#171717]">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Hero */}
        <header className="border-b border-black/15 pb-10">
          <p className="mb-4 text-sm font-semibold tracking-[0.08em] text-[#6b675f]">
            아파트 매도 정체 가이드
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.25] tracking-[-0.035em] sm:text-5xl">
            급매로 내놨는데도
            <br className="hidden sm:block" /> 왜 안 팔릴까요?
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#55514b] sm:text-lg">
            가격을 충분히 낮췄다고 생각하는데도 문의가 없으면 더 내려야 하는지
            고민하게 됩니다. 하지만 매도 정체는 가격 하나만으로 설명되지 않을
            수 있습니다. 실제 시장가격, 동일 면적 거래 빈도, 단지 유동성,
            노출기간과 문의 반응을 함께 확인해야 합니다.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm font-semibold text-[#2b2925]">
              “가격을 내렸다”와 “시장가격보다 싸다”는 같은 의미가 아닙니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#666159]">
              급매 여부는 이전 호가가 아니라 현재 시장에서 매수자가 비교하는
              최근 실거래와 경쟁 매물 기준으로 확인해야 합니다.
            </p>
          </div>
        </header>

        {/* Main question */}
        <section className="py-12">
          <p className="text-sm font-semibold text-[#777168]">
            가격을 더 내리기 전에
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            먼저 “어느 단계에서 막히는지”를 확인해야 합니다.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">문의 없음</p>
              <p className="mt-2 text-lg font-bold">가격 · 노출</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                검색과 비교 단계에서 선택되지 않는 원인을 먼저 봅니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">거래 자체가 적음</p>
              <p className="mt-2 text-lg font-bold">유동성</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                가격보다 매수 수요 자체가 부족한 시장일 수 있습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">문의 후 이탈</p>
              <p className="mt-2 text-lg font-bold">조건 · 전환</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                매물 조건이 실제 비교 과정에서 영향을 주는지 확인합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Reasons */}
        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            급매인데도 반응이 없을 때
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            확인해야 할 5가지 원인
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

        {/* Cases */}
        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            반응에 따라 달라지는 판단
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            같은 급매라도 확인 순서는 다릅니다.
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
                      먼저 볼 항목
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      해석
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((item) => (
                    <tr
                      key={item.situation}
                      className="border-t border-black/10 align-top"
                    >
                      <td className="px-5 py-4 text-sm font-medium leading-6">
                        {item.situation}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold leading-6">
                        {item.firstCheck}
                      </td>
                      <td className="px-5 py-4 text-sm leading-6 text-[#666159]">
                        {item.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Price lowering */}
        <section className="border-t border-black/15 py-12">
          <div className="rounded-3xl bg-[#ebe7dc] p-7 sm:p-9">
            <p className="text-sm font-semibold text-[#777168]">
              가격을 한 번 더 내리기 전에
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em]">
              가격 조정이 실제 원인에 맞는 대응인지 확인해보세요.
            </h2>

            <p className="mt-5 leading-8 text-[#5f5a53]">
              가격이 원인이라면 가격 조정은 직접적인 대응이 될 수 있습니다.
              하지만 거래량이 적거나 특정 평형의 수요가 부족한 상황이라면
              가격만 반복해서 낮춰도 기대한 속도로 반응이 나타나지 않을 수
              있습니다. 먼저 현재 시장의 거래 구조와 실제 반응을 구분하는 것이
              중요합니다.
            </p>
          </div>
        </section>

        {/* Limit */}
        <section className="py-10">
          <h2 className="text-xl font-bold">
            공개 데이터로 확인하기 어려운 조건도 있습니다.
          </h2>

          <p className="mt-4 leading-8 text-[#5f5a53]">
            층, 방향, 내부 수리 상태, 세입자 여부, 입주 가능 시점, 중개 방식,
            경쟁 매물의 개별 조건 등은 실거래 데이터만으로 정확히 판단하기
            어렵습니다. 따라서 데이터 분석은 가격을 무조건 낮추기 위한 근거가
            아니라 현재 매도 정체의 가능성이 높은 원인을 좁히는 참고자료로
            활용하는 것이 적절합니다.
          </p>
        </section>

        {/* CTA */}
        <section className="border-t border-black/15 pt-12">
          <div className="rounded-3xl border border-black bg-[#f4f1e8] p-7 sm:p-10">
            <p className="text-sm font-semibold text-[#777168]">
              정말 가격 문제일까요?
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.35] tracking-[-0.025em] sm:text-3xl">
              가격을 더 내리기 전에
              <br className="hidden sm:block" />
              내 매물의 거래 신호부터 확인해보세요.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#5f5a53]">
              최근 실거래, 동일 면적 거래 공백, 단지 거래량, 등록 기간과
              문의·방문 반응을 함께 분석해 현재 매도 정체의 가능성이 높은
              원인을 확인합니다.
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