import Link from "next/link";

export const metadata = {
  title: "집이 안 팔릴 때 가격을 내려야 할까? | 왜 안 팔릴까",
  description:
    "아파트 매물이 오래 안 팔릴 때 바로 가격을 내리기 전에 최근 실거래, 동일 면적 거래 공백, 단지 거래량, 문의·방문 반응을 함께 확인해야 합니다.",
};

const decisionPoints = [
  {
    number: "01",
    title: "최근 실거래보다 현재 희망가가 얼마나 높은지",
    description:
      "가격 조정을 판단할 때는 이전 호가보다 최근 실제 체결가격과의 차이가 더 중요합니다.",
    detail:
      "매도자가 처음 설정한 가격에서 얼마를 낮췄는지는 매수자의 판단 기준이 아닙니다. 매수자는 최근 동일·유사 면적 실거래와 현재 시장의 다른 매물을 비교합니다. 따라서 희망가가 최근 체결가격보다 얼마나 높은지를 먼저 확인해야 합니다.",
    check:
      "최근 동일·유사 면적 실거래가와 현재 희망가의 차이를 확인합니다.",
    signal: "가격",
  },
  {
    number: "02",
    title: "같은 면적이 실제로 거래되고 있는지",
    description:
      "가격을 낮춰도 해당 평형의 거래 자체가 드물다면 반응이 즉시 나타나지 않을 수 있습니다.",
    detail:
      "단지 전체에서는 거래가 발생하고 있어도 특정 면적의 거래가 오래 없다면 해당 평형의 유동성이 낮을 수 있습니다. 이런 상황에서는 단순 가격 인하만으로 거래 가능성을 판단하기 어렵습니다.",
    check:
      "동일 면적의 마지막 거래 시점과 최근 거래 건수를 확인합니다.",
    signal: "유동성",
  },
  {
    number: "03",
    title: "단지 전체 시장이 움직이고 있는지",
    description:
      "내 매물의 문제인지 단지 전체의 거래 속도가 느린지 구분해야 합니다.",
    detail:
      "최근 수개월 동안 단지 전체 거래가 거의 없다면 매수 수요 자체가 약한 시기일 수 있습니다. 이 경우 가격을 낮추더라도 새로운 매수자가 시장에 들어오지 않으면 반응이 제한적일 수 있습니다.",
    check:
      "최근 6개월~12개월 단지 거래량과 단지 규모를 함께 확인합니다.",
    signal: "유동성",
  },
  {
    number: "04",
    title: "충분히 노출됐는데도 문의가 없는지",
    description:
      "등록기간이 길고 문의가 거의 없다면 가격이나 노출 단계의 문제 가능성이 커집니다.",
    detail:
      "매물을 등록한 지 얼마 되지 않았다면 가격 조정을 판단하기 이를 수 있습니다. 반대로 충분한 기간 동안 시장에 노출됐는데도 문의가 거의 없다면 현재 조건이 매수자의 초기 비교 단계에서 선택받지 못하고 있을 가능성을 살펴봐야 합니다.",
    check:
      "등록 시점부터 현재까지의 기간과 실제 문의 횟수를 함께 확인합니다.",
    signal: "노출",
  },
  {
    number: "05",
    title: "문의는 있는데 방문·협상에서 멈추는지",
    description:
      "문의가 발생한다면 가격 외의 조건이 더 중요한 원인일 수도 있습니다.",
    detail:
      "가격이 매수자의 관심을 끌 정도라서 문의가 발생했는데 실제 방문이나 협상으로 이어지지 않는다면 층, 방향, 내부 상태, 입주 조건 등 개별 조건을 함께 살펴볼 필요가 있습니다.",
    check:
      "문의 수와 방문 수를 분리해서 어느 단계에서 이탈하는지 확인합니다.",
    signal: "전환",
  },
];

const decisionRows = [
  {
    situation: "실거래보다 희망가가 뚜렷하게 높고 문의도 거의 없음",
    judgment: "가격 조정 검토",
    reason:
      "가격 비교 단계에서 후보에서 제외될 가능성을 우선 확인합니다.",
  },
  {
    situation: "희망가는 실거래와 비슷하지만 동일 면적 거래가 오래 없음",
    judgment: "가격보다 유동성 확인",
    reason:
      "해당 평형 자체의 거래 빈도가 낮은 상황일 수 있습니다.",
  },
  {
    situation: "단지 전체 거래량이 매우 적음",
    judgment: "시장 속도 확인",
    reason:
      "개별 매물보다 매수 수요 자체가 약한 상황인지 봅니다.",
  },
  {
    situation: "등록기간이 짧음",
    judgment: "추가 관찰 가능",
    reason:
      "시장 반응을 판단하기에 아직 충분한 시간이 지나지 않았을 수 있습니다.",
  },
  {
    situation: "문의는 있으나 방문·협상이 적음",
    judgment: "조건 확인",
    reason:
      "가격보다 개별 매물 조건이나 전환 단계의 문제가 있을 수 있습니다.",
  },
];

export default function ShouldLowerPriceGuidePage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#171717]">
      <article className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-black/15 pb-10">
          <p className="mb-4 text-sm font-semibold tracking-[0.08em] text-[#6b675f]">
            아파트 매도 정체 가이드
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-[1.25] tracking-[-0.035em] sm:text-5xl">
            집이 안 팔릴 때,
            <br className="hidden sm:block" /> 가격부터 내려야 할까요?
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#55514b] sm:text-lg">
            매물이 오래 안 팔리면 가장 먼저 떠오르는 대응이 가격 인하입니다.
            하지만 가격 조정은 현재 매도 정체의 원인이 실제로 가격인지 확인한
            뒤 판단하는 것이 좋습니다. 최근 실거래, 거래 유동성, 등록기간,
            문의·방문 반응을 함께 보면 판단 범위를 좁힐 수 있습니다.
          </p>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white/70 p-5">
            <p className="text-sm font-semibold text-[#2b2925]">
              가격 인하는 하나의 대응이지, 모든 매도 정체의 정답은 아닙니다.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#666159]">
              가격이 원인이 아닌 상황에서 반복적으로 가격만 낮추면 기대한
              반응이 나오지 않으면서 매도자의 선택지만 줄어들 수 있습니다.
            </p>
          </div>
        </header>

        <section className="py-12">
          <p className="text-sm font-semibold text-[#777168]">
            가격 조정 전에 던져야 할 질문
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            “안 팔린다”보다 중요한 건 왜 안 팔리는가입니다.
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">실거래 대비 높음</p>
              <p className="mt-2 text-lg font-bold">가격</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                현재 가격이 실제 시장과 얼마나 벌어져 있는지 확인합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">거래 자체가 적음</p>
              <p className="mt-2 text-lg font-bold">유동성</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                가격보다 매수 수요 자체가 부족한지 살펴봅니다.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-sm text-[#777168]">문의 후 이탈</p>
              <p className="mt-2 text-lg font-bold">조건 · 전환</p>
              <p className="mt-3 text-sm leading-7 text-[#666159]">
                가격 외 개별 조건이 영향을 주는지 봅니다.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-black/15 py-12">
          <p className="text-sm font-semibold text-[#777168]">
            가격을 내리기 전에 확인할 항목
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            판단에 필요한 5가지 신호
          </h2>

          <div className="mt-8 space-y-5">
            {decisionPoints.map((item) => (
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
            상황에 따라 달라지는 대응
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
            가격을 내릴지 말지는 반응과 거래 흐름을 함께 봐야 합니다.
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
                      우선 판단
                    </th>
                    <th className="px-5 py-4 text-sm font-semibold">
                      이유
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {decisionRows.map((row) => (
                    <tr
                      key={row.situation}
                      className="border-t border-black/10 align-top"
                    >
                      <td className="px-5 py-4 text-sm font-medium leading-6">
                        {row.situation}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold leading-6">
                        {row.judgment}
                      </td>
                      <td className="px-5 py-4 text-sm leading-6 text-[#666159]">
                        {row.reason}
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
              가격 조정은 마지막 숫자 하나가 아니라
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-[-0.025em]">
              현재 매물이 시장에서 어떤 반응을 받고 있는지를 보고 판단합니다.
            </h2>

            <p className="mt-5 leading-8 text-[#5f5a53]">
              같은 가격 차이라도 거래가 활발한 단지와 거래가 거의 없는
              단지에서는 의미가 다를 수 있습니다. 또한 문의조차 없는 매물과
              문의는 있지만 방문으로 이어지지 않는 매물도 대응 방향이
              다릅니다. 가격을 조정하기 전에 현재 막혀 있는 단계부터
              구분하는 것이 중요합니다.
            </p>
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-xl font-bold">
            데이터 분석이 가격 결정을 대신하는 것은 아닙니다.
          </h2>

          <p className="mt-4 leading-8 text-[#5f5a53]">
            실제 매도가격은 매도 일정, 대출 상황, 세금, 잔금 계획, 개인의
            자금 필요성 등 개별 사정에 따라 달라질 수 있습니다. 공개 데이터와
            시장 반응 분석은 현재 매도 정체의 원인을 좁히고 가격 조정의
            필요성을 검토하는 참고자료로 활용할 수 있습니다.
          </p>
        </section>

        <section className="border-t border-black/15 pt-12">
          <div className="rounded-3xl border border-black bg-[#f4f1e8] p-7 sm:p-10">
            <p className="text-sm font-semibold text-[#777168]">
              가격을 더 내리기 전에 확인해보세요.
            </p>

            <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-[1.35] tracking-[-0.025em] sm:text-3xl">
              정말 가격이 문제인지,
              <br className="hidden sm:block" />
              다른 곳에서 막혀 있는지 분석합니다.
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-[#5f5a53]">
              최근 실거래, 동일 면적 거래 공백, 단지 거래량, 등록 기간,
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