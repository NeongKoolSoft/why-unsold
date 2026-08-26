import type {
  Diagnosis,
} from "../report-types";

export const PREVIEW_SAMPLE_DIAGNOSIS:
  Diagnosis = {
    cause:
      "price",

    label:
      "가격 경쟁력",

    headline:
      "현재 희망가가 비교 가격보다 높아 초기 문의가 막힐 가능성이 있습니다.",

    summary:
      "최근 실거래와 확인한 경쟁 매물 가격을 함께 비교하고 실제 문의 변화를 관찰해야 합니다.",

    complex:
      "부산광역시 부산진구 샘플동 샘플아파트",

    apartmentName:
      "샘플아파트",

    area:
      "전용 84.43㎡",

    askingPrice:
      "3억원",

    listedAt:
      "2026년 7월",

    reportId:
      "PREVIEW-SAMPLE-001",

    createdAt:
      "2026-08-27T00:00:00.000Z",

    dataDate:
      "2026-08-27",

    highlights: [
      {
        value:
          "2억 8,500만원",

        label:
          "최근 실거래",
      },

      {
        value:
          "2억 9,500만원",

        label:
          "경쟁 매물 최저가",
      },

      {
        value:
          "문의 0회",

        label:
          "현재 매수 반응",
      },
    ],

    evidence: [
      {
        number:
          "01",

        label:
          "가격 위치",

        title:
          "현재 희망가가 비교 가격보다 높습니다.",

        description:
          "최근 실거래와 사용자가 확인한 경쟁 매물 가격보다 현재 희망가가 높습니다.",
      },

      {
        number:
          "02",

        label:
          "거래 유동성",

        title:
          "동일 면적 거래 빈도를 함께 봐야 합니다.",

        description:
          "최근 거래량과 마지막 거래 이후 기간을 함께 확인해야 합니다.",
      },

      {
        number:
          "03",

        label:
          "매수 반응",

        title:
          "현재까지 문의가 없습니다.",

        description:
          "가격과 노출 상태를 구분해서 점검할 필요가 있습니다.",
      },
    ],

    actionTitle:
      "가격과 노출 상태를 먼저 확인합니다.",

    actionDescription:
      "경쟁 매물과의 가격 차이, 포털 노출과 매물 설명 상태를 확인한 뒤 문의 변화를 기록합니다.",

    metrics: {
      askingPrice:
        30000,

      latestTradePrice:
        28500,

      lowestListingPrice:
        29500,

      tradeGapPercent:
        5.3,

      listingGapPercent:
        1.7,

      complexTransactionCount12m:
        8,

      sameAreaTransactionCount12m:
        3,

      monthsSinceLastTrade:
        4,

      households:
        500,

      listedDays:
        42,

      inquiries:
        0,

      visits:
        0,

      offers:
        0,
    },

    aiDetailAnalysis: {
      executiveDiagnosis: {
        headline:
          "가격 경쟁력과 실제 노출 상태를 먼저 구분해서 확인해야 합니다.",

        summary:
          "현재 희망가는 비교 가격보다 높고 문의가 없습니다. 가격 문제로 단정하기 전에 실제 노출 상태도 함께 확인해야 합니다.",

        keyReason:
          "가격 차이와 문의 부재",
      },

      priceAnalysis: {
        title:
          "현재 희망가의 비교 위치를 확인해야 합니다.",

        summary:
          "최근 실거래와 경쟁 매물 가격을 함께 비교해야 합니다.",

        details: [
          "현재 희망가는 최근 실거래보다 높습니다.",
          "사용자가 확인한 경쟁 매물 최저가와도 차이가 있습니다.",
        ],
      },

      liquidityAnalysis: {
        title:
          "거래 빈도도 함께 고려해야 합니다.",

        summary:
          "가격 조정만으로 즉시 거래된다고 단정할 수 없습니다.",

        details: [
          "최근 1년 단지 거래량을 함께 확인해야 합니다.",
          "동일 면적의 마지막 거래 이후 기간도 판단에 필요합니다.",
        ],
      },

      marketInterpretation: {
        title:
          "비교 매물과 실제 반응을 함께 봐야 합니다.",

        summary:
          "현재 확인된 가격과 문의 흐름을 기준으로 판단합니다.",

        details: [
          "경쟁 매물 가격은 사용자가 확인한 비교 대상입니다.",
          "현재 노출 상태는 별도 확인이 필요합니다.",
        ],
      },

      bottleneckAnalysis: {
        primary:
          "price",

        label:
          "가격 경쟁력",

        reason:
          "현재 희망가가 비교 가격보다 높고 문의가 없는 상태입니다.",

        supportingSignals: [
          "최근 실거래와 현재 희망가 사이에 차이가 있습니다.",
          "현재까지 입력된 문의 횟수는 0회입니다.",
        ],

        uncertainties: [
          "실제 포털 노출 상태는 확인되지 않았습니다.",
          "매수자가 문의하지 않은 구체적인 이유는 알 수 없습니다.",
        ],
      },

      priceScenarios: [
        {
          type:
            "maintain",

          label:
            "가격 유지",

          description:
            "노출 상태를 먼저 확인하며 현재 가격을 유지합니다.",

          suitableWhen: [
            "가격보다 노출 확인이 먼저 필요한 경우",
          ],

          risks: [
            "문의가 계속 없으면 매도 기간이 길어질 수 있습니다.",
          ],

          checkpoints: [
            "노출 점검 이후 문의 변화를 확인합니다.",
          ],
        },

        {
          type:
            "adjust_small",

          label:
            "소폭 조정",

          description:
            "비교 매물과의 선택 경쟁력을 개선합니다.",

          suitableWhen: [
            "노출을 점검해도 문의가 없는 경우",
          ],

          risks: [
            "유동성이 낮으면 가격 조정만으로 거래되지 않을 수 있습니다.",
          ],

          checkpoints: [
            "조정 이후 문의와 방문 변화를 확인합니다.",
          ],
        },

        {
          type:
            "adjust_active",

          label:
            "적극 조정",

          description:
            "매도 기한을 우선할 때 검토합니다.",

          suitableWhen: [
            "빠른 매도가 필요하고 반응이 없는 경우",
          ],

          risks: [
            "필요 이상으로 가격을 낮출 수 있습니다.",
          ],

          checkpoints: [
            "허용 가능한 가격 범위와 매도 기한을 함께 확인합니다.",
          ],
        },
      ],

      actionPlan30Days: [
        {
          period:
            "1-7",

          title:
            "노출과 경쟁 조건 확인",

          actions: [
            "포털 노출과 경쟁 매물 조건을 확인합니다.",
          ],

          decisionCriteria: [
            "현재 매물이 실제 비교군에서 어느 위치인지 확인합니다.",
          ],
        },

        {
          period:
            "8-14",

          title:
            "문의 흐름 기록",

          actions: [
            "문의와 방문 횟수를 기록합니다.",
          ],

          decisionCriteria: [
            "매수 반응이 어느 단계에서 막히는지 확인합니다.",
          ],
        },

        {
          period:
            "15-30",

          title:
            "전략 유지 또는 변경",

          actions: [
            "누적된 반응을 기준으로 전략을 다시 판단합니다.",
          ],

          decisionCriteria: [
            "매도 기한과 실제 반응을 함께 확인합니다.",
          ],
        },
      ],

      decisionTriggers: [
        {
          type:
            "maintain",

          title:
            "유지 신호",

          condition:
            "문의나 방문이 증가하는 경우",

          action:
            "현재 전략을 유지하며 협상 단계까지 관찰합니다.",
        },

        {
          type:
            "adjust",

          title:
            "변경 신호",

          condition:
            "노출 점검 이후에도 반응이 없는 경우",

          action:
            "가격 또는 노출 조건 변경을 검토합니다.",
        },

        {
          type:
            "reassess",

          title:
            "재진단 신호",

          condition:
            "방문은 있지만 제안이 없는 경우",

          action:
            "현장 조건과 체감 가격을 중심으로 다시 진단합니다.",
        },
      ],

      finalStrategy: {
        headline:
          "노출 상태를 확인하고 실제 반응에 따라 가격 전략을 결정합니다.",

        summary:
          "가격을 바로 변경하기보다 확인되지 않은 노출 상태를 먼저 점검하고 이후 반응을 기록합니다.",

        priorities: [
          "포털 노출 상태 확인",
          "경쟁 매물 조건 정리",
          "문의와 방문 흐름 기록",
        ],
      },

      limitations: [
        "공개 실거래와 사용자 입력만으로 적정 매도가를 확정할 수 없습니다.",
        "실제 매수자의 판단 이유는 별도 확인이 필요합니다.",
      ],
    },
  };