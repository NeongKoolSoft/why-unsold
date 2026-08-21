"use client";

import { FormEvent, useRef, useState } from "react";
import DetailReport from "./detail-report";
import type {
  AiDetailAnalysis,
  Cause,
  Diagnosis,
} from "./report-types";

type RealEstateSummary = {
  complexTransactionCount12m: number;
  sameAreaTransactionCount12m: number;
  latestTradePrice: number | null;
  monthsSinceLastTrade: number | null;
  latestTransaction: {
    dealYear: number;
    dealMonth: number;
    dealDay: number;
  } | null;
};

type AreaLookupResult = {
  availableAreas: number[];
  matchedTransactionCount: number;
  searchedMonths: number;
  error?: string;
  detail?: string;
};

type AnalysisApiResponse = {
  analysis?: AiDetailAnalysis;
  error?: string;
  detail?: string;
};

type Region = {
  name: string;
  districts: readonly (readonly [string, string])[];
};

type TossPaymentWindow = {
  on: (
    eventName: "paymentRequest",
    callback: () => void | Promise<void>
  ) => void;
  destroy: () => void;
};

type TossWidgets = {
  setAmount: (amount: {
    value: number;
    currency: "KRW";
  }) => Promise<void>;
  renderPaymentWindow: () => Promise<TossPaymentWindow>;
  requestPayment: (request: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
};

type TossPaymentsInstance = {
  widgets: (params: {
    customerKey: string;
  }) => TossWidgets;
};

declare global {
  interface Window {
    TossPayments?: (
      clientKey: string
    ) => TossPaymentsInstance;
  }
}

const REPORT_PRICE = 20000;
const TOSS_SDK_URL =
  "https://js.tosspayments.com/v2/standard";

function loadTossPaymentsSdk() {
  return new Promise<void>(
    (resolve, reject) => {
      if (window.TossPayments) {
        resolve();
        return;
      }

      const existingScript =
        document.querySelector<HTMLScriptElement>(
          `script[src="${TOSS_SDK_URL}"]`
        );

      if (existingScript) {
        existingScript.addEventListener(
          "load",
          () => resolve(),
          { once: true }
        );

        existingScript.addEventListener(
          "error",
          () =>
            reject(
              new Error(
                "토스페이먼츠 결제 모듈을 불러오지 못했습니다."
              )
            ),
          { once: true }
        );

        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.src =
        TOSS_SDK_URL;
      script.async = true;

      script.onload = () =>
        resolve();

      script.onerror = () =>
        reject(
          new Error(
            "토스페이먼츠 결제 모듈을 불러오지 못했습니다."
          )
        );

      document.head.appendChild(
        script
      );
    }
  );
}

function createOrderId() {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return `WHYUNSOLD-${crypto
      .randomUUID()
      .replaceAll("-", "")}`;
  }

  return (
    "WHYUNSOLD-" +
    Date.now().toString(36) +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 12)
  );
}

const REGIONS: readonly Region[] = [
  {
    name: "서울특별시",
    districts: [
      ["11110", "종로구"],
      ["11140", "중구"],
      ["11170", "용산구"],
      ["11200", "성동구"],
      ["11215", "광진구"],
      ["11230", "동대문구"],
      ["11260", "중랑구"],
      ["11290", "성북구"],
      ["11305", "강북구"],
      ["11320", "도봉구"],
      ["11350", "노원구"],
      ["11380", "은평구"],
      ["11410", "서대문구"],
      ["11440", "마포구"],
      ["11470", "양천구"],
      ["11500", "강서구"],
      ["11530", "구로구"],
      ["11545", "금천구"],
      ["11560", "영등포구"],
      ["11590", "동작구"],
      ["11620", "관악구"],
      ["11650", "서초구"],
      ["11680", "강남구"],
      ["11710", "송파구"],
      ["11740", "강동구"],
    ],
  },
  {
    name: "부산광역시",
    districts: [
      ["26110", "중구"],
      ["26140", "서구"],
      ["26170", "동구"],
      ["26200", "영도구"],
      ["26230", "부산진구"],
      ["26260", "동래구"],
      ["26290", "남구"],
      ["26320", "북구"],
      ["26350", "해운대구"],
      ["26380", "사하구"],
      ["26410", "금정구"],
      ["26440", "강서구"],
      ["26470", "연제구"],
      ["26500", "수영구"],
      ["26530", "사상구"],
      ["26710", "기장군"],
    ],
  },
  {
    name: "대구광역시",
    districts: [
      ["27110", "중구"],
      ["27140", "동구"],
      ["27170", "서구"],
      ["27200", "남구"],
      ["27230", "북구"],
      ["27260", "수성구"],
      ["27290", "달서구"],
      ["27710", "달성군"],
      ["27720", "군위군"],
    ],
  },
  {
    name: "인천광역시",
    districts: [
      ["28125", "제물포구"],
      ["28155", "영종구"],
      ["28177", "미추홀구"],
      ["28185", "연수구"],
      ["28200", "남동구"],
      ["28237", "부평구"],
      ["28245", "계양구"],
      ["28275", "서해구"],
      ["28290", "검단구"],
      ["28710", "강화군"],
      ["28720", "옹진군"],
    ],
  },
  {
    name: "대전광역시",
    districts: [
      ["30110", "동구"],
      ["30140", "중구"],
      ["30170", "서구"],
      ["30200", "유성구"],
      ["30230", "대덕구"],
    ],
  },
  {
    name: "울산광역시",
    districts: [
      ["31110", "중구"],
      ["31140", "남구"],
      ["31170", "동구"],
      ["31200", "북구"],
      ["31710", "울주군"],
    ],
  },
  {
    name: "세종특별자치시",
    districts: [["36110", "세종시"]],
  },
  {
    name: "경기도",
    districts: [
      ["41111", "수원시 장안구"],
      ["41113", "수원시 권선구"],
      ["41115", "수원시 팔달구"],
      ["41117", "수원시 영통구"],
      ["41131", "성남시 수정구"],
      ["41133", "성남시 중원구"],
      ["41135", "성남시 분당구"],
      ["41150", "의정부시"],
      ["41171", "안양시 만안구"],
      ["41173", "안양시 동안구"],
      ["41192", "부천시 원미구"],
      ["41194", "부천시 소사구"],
      ["41196", "부천시 오정구"],
      ["41210", "광명시"],
      ["41220", "평택시"],
      ["41250", "동두천시"],
      ["41271", "안산시 상록구"],
      ["41273", "안산시 단원구"],
      ["41281", "고양시 덕양구"],
      ["41285", "고양시 일산동구"],
      ["41287", "고양시 일산서구"],
      ["41290", "과천시"],
      ["41310", "구리시"],
      ["41360", "남양주시"],
      ["41370", "오산시"],
      ["41390", "시흥시"],
      ["41410", "군포시"],
      ["41430", "의왕시"],
      ["41450", "하남시"],
      ["41461", "용인시 처인구"],
      ["41463", "용인시 기흥구"],
      ["41465", "용인시 수지구"],
      ["41480", "파주시"],
      ["41500", "이천시"],
      ["41550", "안성시"],
      ["41570", "김포시"],
      ["41591", "화성시 만세구"],
      ["41593", "화성시 효행구"],
      ["41595", "화성시 병점구"],
      ["41597", "화성시 동탄구"],
      ["41610", "광주시"],
      ["41630", "양주시"],
      ["41650", "포천시"],
      ["41670", "여주시"],
      ["41800", "연천군"],
      ["41820", "가평군"],
      ["41830", "양평군"],
    ],
  },
  {
    name: "강원특별자치도",
    districts: [
      ["51110", "춘천시"],
      ["51130", "원주시"],
      ["51150", "강릉시"],
      ["51170", "동해시"],
      ["51190", "태백시"],
      ["51210", "속초시"],
      ["51230", "삼척시"],
      ["51720", "홍천군"],
      ["51730", "횡성군"],
      ["51750", "영월군"],
      ["51760", "평창군"],
      ["51770", "정선군"],
      ["51780", "철원군"],
      ["51790", "화천군"],
      ["51800", "양구군"],
      ["51810", "인제군"],
      ["51820", "고성군"],
      ["51830", "양양군"],
    ],
  },
  {
    name: "충청북도",
    districts: [
      ["43111", "청주시 상당구"],
      ["43112", "청주시 서원구"],
      ["43113", "청주시 흥덕구"],
      ["43114", "청주시 청원구"],
      ["43130", "충주시"],
      ["43150", "제천시"],
      ["43720", "보은군"],
      ["43730", "옥천군"],
      ["43740", "영동군"],
      ["43745", "증평군"],
      ["43750", "진천군"],
      ["43760", "괴산군"],
      ["43770", "음성군"],
      ["43800", "단양군"],
    ],
  },
  {
    name: "충청남도",
    districts: [
      ["44131", "천안시 동남구"],
      ["44133", "천안시 서북구"],
      ["44150", "공주시"],
      ["44180", "보령시"],
      ["44200", "아산시"],
      ["44210", "서산시"],
      ["44230", "논산시"],
      ["44250", "계룡시"],
      ["44270", "당진시"],
      ["44710", "금산군"],
      ["44760", "부여군"],
      ["44770", "서천군"],
      ["44790", "청양군"],
      ["44800", "홍성군"],
      ["44810", "예산군"],
      ["44825", "태안군"],
    ],
  },
  {
    name: "전북특별자치도",
    districts: [
      ["52111", "전주시 완산구"],
      ["52113", "전주시 덕진구"],
      ["52130", "군산시"],
      ["52140", "익산시"],
      ["52180", "정읍시"],
      ["52190", "남원시"],
      ["52210", "김제시"],
      ["52710", "완주군"],
      ["52720", "진안군"],
      ["52730", "무주군"],
      ["52740", "장수군"],
      ["52750", "임실군"],
      ["52770", "순창군"],
      ["52790", "고창군"],
      ["52800", "부안군"],
    ],
  },
  {
    name: "전남광주통합특별시",
    districts: [
      ["29110", "동구"],
      ["29140", "서구"],
      ["29155", "남구"],
      ["29170", "북구"],
      ["29200", "광산구"],
      ["46110", "목포시"],
      ["46130", "여수시"],
      ["46150", "순천시"],
      ["46170", "나주시"],
      ["46230", "광양시"],
      ["46710", "담양군"],
      ["46720", "곡성군"],
      ["46730", "구례군"],
      ["46770", "고흥군"],
      ["46780", "보성군"],
      ["46790", "화순군"],
      ["46800", "장흥군"],
      ["46810", "강진군"],
      ["46820", "해남군"],
      ["46830", "영암군"],
      ["46840", "무안군"],
      ["46860", "함평군"],
      ["46870", "영광군"],
      ["46880", "장성군"],
      ["46890", "완도군"],
      ["46900", "진도군"],
      ["46910", "신안군"],
    ],
  },
  {
    name: "경상북도",
    districts: [
      ["47111", "포항시 남구"],
      ["47113", "포항시 북구"],
      ["47130", "경주시"],
      ["47150", "김천시"],
      ["47170", "안동시"],
      ["47190", "구미시"],
      ["47210", "영주시"],
      ["47230", "영천시"],
      ["47250", "상주시"],
      ["47280", "문경시"],
      ["47290", "경산시"],
      ["47720", "의성군"],
      ["47730", "청송군"],
      ["47750", "영양군"],
      ["47760", "영덕군"],
      ["47770", "청도군"],
      ["47820", "고령군"],
      ["47830", "성주군"],
      ["47840", "칠곡군"],
      ["47900", "예천군"],
      ["47920", "봉화군"],
      ["47930", "울진군"],
      ["47940", "울릉군"],
    ],
  },
  {
    name: "경상남도",
    districts: [
      ["48121", "창원시 의창구"],
      ["48123", "창원시 성산구"],
      ["48125", "창원시 마산합포구"],
      ["48127", "창원시 마산회원구"],
      ["48129", "창원시 진해구"],
      ["48170", "진주시"],
      ["48220", "통영시"],
      ["48240", "사천시"],
      ["48250", "김해시"],
      ["48270", "밀양시"],
      ["48310", "거제시"],
      ["48330", "양산시"],
      ["48720", "의령군"],
      ["48730", "함안군"],
      ["48740", "창녕군"],
      ["48820", "고성군"],
      ["48840", "남해군"],
      ["48850", "하동군"],
      ["48860", "산청군"],
      ["48870", "함양군"],
      ["48880", "거창군"],
      ["48890", "합천군"],
    ],
  },
  {
    name: "제주특별자치도",
    districts: [
      ["50110", "제주시"],
      ["50130", "서귀포시"],
    ],
  },
];

const causeMeta: Record<
  Cause,
  {
    label: string;
    headline: string;
    actionTitle: string;
    actionDescription: string;
  }
> = {
  price: {
    label: "가격",
    headline:
      "희망가격이 현재 매수자의 비교 기준보다 높을 가능성이 큽니다.",
    actionTitle:
      "같은 면적의 실제 경쟁 매물 3개와 최저가격",
    actionDescription:
      "호가만 비교하지 말고 층·방향·내부 상태가 비슷한 실제 매물인지 확인해야 가격 조정 폭을 판단할 수 있습니다.",
  },

  liquidity: {
    label: "낮은 거래량",
    headline:
      "가격보다 낮은 거래량이 원인일 가능성이 큽니다.",
    actionTitle:
      "같은 면적의 실제 경쟁 매물 수와 최저가격",
    actionDescription:
      "공개 매물이 실제 몇 채인지 확인해야 가격과 유동성 중 어느 요인이 더 큰지 구분할 수 있습니다.",
  },

  exposure: {
    label: "노출 부족",
    headline:
      "가격보다 매물이 충분히 노출되지 않는 것이 원인일 수 있습니다.",
    actionTitle:
      "중개사 두 곳의 실제 노출 화면과 대표 사진",
    actionDescription:
      "매수자가 보는 첫 화면을 확인해야 낮은 문의가 시장 수요 때문인지 노출 방식 때문인지 구분할 수 있습니다.",
  },

  conversion: {
    label: "문의 전환",
    headline:
      "문의가 방문으로 이어지지 않는 것이 원인일 가능성이 큽니다.",
    actionTitle:
      "최근 문의자가 방문을 포기한 이유 3건",
    actionDescription:
      "가격·입주일·사진 중 같은 이유가 반복되는지 확인하면 방문 전환을 막는 조건을 좁힐 수 있습니다.",
  },

  condition: {
    label: "현장 조건",
    headline:
      "방문 이후 집의 조건이나 협상 장벽이 원인일 가능성이 큽니다.",
    actionTitle:
      "방문자가 반복해서 언급한 조건 하나",
    actionDescription:
      "수리·층·방향·입주일 중 반복되는 항목을 확인해야 보완할지 가격에 반영할지 결정할 수 있습니다.",
  },
};

function numberFrom(
  form: FormData,
  name: string
) {
  return Number(
    form.get(name) ?? 0
  );
}

function optionalNumberFrom(
  form: FormData,
  name: string
) {
  const rawValue =
    form.get(name);

  if (
    rawValue === null ||
    String(rawValue).trim() === ""
  ) {
    return null;
  }

  const value =
    Number(rawValue);

  return Number.isFinite(value)
    ? value
    : null;
}

function formatPrice(
  value: number
) {
  if (value >= 10000) {
    const eok =
      Math.floor(value / 10000);

    const remainder =
      value % 10000;

    return remainder
      ? `${eok}억 ${remainder.toLocaleString(
          "ko-KR"
        )}만원`
      : `${eok}억원`;
  }

  return `${value.toLocaleString(
    "ko-KR"
  )}만원`;
}

function formatGap(
  value: number
) {
  if (
    Math.abs(value) < 0.05
  ) {
    return "같은 수준";
  }

  return `${Math.abs(value).toFixed(
    1
  )}% ${
    value > 0
      ? "높음"
      : "낮음"
  }`;
}

function formatMonths(
  months: number
) {
  if (months < 12) {
    return `${months}개월`;
  }

  const years =
    Math.floor(months / 12);

  const rest =
    months % 12;

  return rest
    ? `${years}년 ${rest}개월`
    : `${years}년`;
}

function reportDates(
  listedDays: number
) {
  const now =
    new Date();

  const listed =
    new Date(now);

  listed.setDate(
    listed.getDate() -
      listedDays
  );

  const pad = (
    value: number
  ) =>
    String(value).padStart(
      2,
      "0"
    );

  return {
    listedAt:
      `${listed.getFullYear()}년 ` +
      `${listed.getMonth() + 1}월`,

    createdAt:
      `${now.getFullYear()}.` +
      `${pad(
        now.getMonth() + 1
      )}.` +
      `${pad(now.getDate())}`,

    reportId:
      `REPORT ` +
      `${String(
        now.getFullYear()
      ).slice(-2)}` +
      `${pad(
        now.getMonth() + 1
      )}` +
      `${pad(now.getDate())}`,
  };
}

function priceConclusion(
  tradeGap: number,
  listingGap: number
) {
  if (
    tradeGap > 3 ||
    listingGap > 3
  ) {
    return "희망가는 현재 비교 기준보다 높은 편입니다.";
  }

  if (
    tradeGap < -3 &&
    listingGap < -3
  ) {
    return "희망가는 비교 기준보다 낮은 편입니다.";
  }

  return "희망가는 명백하게 비싼 가격으로 보기 어렵습니다.";
}

function buildDiagnosis(
  form: FormData
): Diagnosis {
  const complex =
    String(
      form.get("complex") ?? ""
    );

  const apartmentName =
    String(
      form.get(
        "apartmentName"
      ) ?? ""
    ).trim();

  const area =
    String(
      form.get("area") ?? ""
    );

  const asking =
    numberFrom(
      form,
      "askingPrice"
    );

  const lastTrade =
    numberFrom(
      form,
      "lastTradePrice"
    );

  const lowestListing =
    numberFrom(
      form,
      "lowestListingPrice"
    );

  const transactions =
    numberFrom(
      form,
      "transactions12m"
    );

  const monthsSinceTrade =
    numberFrom(
      form,
      "monthsSinceTrade"
    );

  const households =
    optionalNumberFrom(
      form,
      "households"
    );

  const listedDays =
    numberFrom(
      form,
      "listedDays"
    );

  const inquiries =
    optionalNumberFrom(
      form,
      "inquiries"
    );

  const visits =
    optionalNumberFrom(
      form,
      "visits"
    );

  const offers =
    optionalNumberFrom(
      form,
      "offers"
    );

  const condition =
    String(
      form.get(
        "condition"
      ) ?? "unknown"
    );

  const tradeGap =
    ((asking / lastTrade) -
      1) *
    100;

  const listingGap =
    ((asking /
      lowestListing) -
      1) *
    100;

  const visitRate =
    inquiries !== null &&
    inquiries > 0 &&
    visits !== null
      ? visits / inquiries
      : null;

  const turnover =
    households !== null &&
    households > 0
      ? (transactions /
          households) *
        100
      : null;

  const scores: Record<
    Cause,
    number
  > = {
    price: 0,
    liquidity: 0,
    exposure: 0,
    conversion: 0,
    condition: 0,
  };

  if (tradeGap > 2) {
    scores.price +=
      Math.min(
        55,
        18 + tradeGap * 3
      );
  }

  if (listingGap > 0) {
    scores.price +=
      Math.min(
        45,
        12 +
          listingGap * 4
      );
  }

  if (
    listedDays >= 45 &&
    (tradeGap > 0 ||
      listingGap > 0)
  ) {
    scores.price += 12;
  }

  scores.liquidity +=
    transactions === 0
      ? 58
      : transactions === 1
        ? 42
        : transactions <= 3
          ? 24
          : 4;

  scores.liquidity +=
    monthsSinceTrade >= 24
      ? 35
      : monthsSinceTrade >= 12
        ? 23
        : monthsSinceTrade >= 6
          ? 10
          : 0;

  if (
    households !== null &&
    households < 100
  ) {
    scores.liquidity += 15;
  }

  if (
    inquiries !== null &&
    inquiries <= 1
  ) {
    scores.liquidity += 8;
  }

  if (inquiries !== null) {
    if (listedDays >= 30) {
      scores.exposure += 25;
    }

    scores.exposure +=
      inquiries === 0
        ? 42
        : inquiries === 1
          ? 24
          : 0;

    if (
      tradeGap <= 2 &&
      listingGap <= 2
    ) {
      scores.exposure += 25;
    }

    if (
      transactions >= 3
    ) {
      scores.exposure += 12;
    }
  }

  if (
    inquiries !== null &&
    visits !== null
  ) {
    if (
      inquiries >= 3
    ) {
      scores.conversion +=
        25;
    }

    if (
      inquiries >= 3 &&
      visits === 0
    ) {
      scores.conversion +=
        42;
    } else if (
      inquiries >= 4 &&
      visitRate !== null &&
      visitRate < 0.3
    ) {
      scores.conversion +=
        30;
    }

    if (
      tradeGap <= 5
    ) {
      scores.conversion +=
        10;
    }
  }

  if (
    visits !== null ||
    condition ===
      "needs-repair"
  ) {
    if (
      visits !== null &&
      visits >= 2
    ) {
      scores.condition +=
        28;
    }

    if (
      visits !== null &&
      visits >= 4
    ) {
      scores.condition +=
        18;
    }

    if (
      visits !== null &&
      visits >= 2 &&
      offers === 0
    ) {
      scores.condition +=
        24;
    }

    if (
      condition ===
      "needs-repair"
    ) {
      scores.condition +=
        32;
    }

    if (
      tradeGap <= 2 &&
      listingGap <= 2
    ) {
      scores.condition +=
        12;
    }
  }

  const priority: Cause[] = [
    "price",
    "liquidity",
    "exposure",
    "conversion",
    "condition",
  ];

  const cause =
    priority.reduce(
      (
        winner,
        current
      ) =>
        scores[current] >
        scores[winner]
          ? current
          : winner
    );

  const meta =
    causeMeta[cause];

  const dates =
    reportDates(
      listedDays
    );

  const summaryMap: Record<
    Cause,
    string
  > = {
    price:
      `희망가 ${formatPrice(
        asking
      )}은 최근 실거래보다 ${formatGap(
        tradeGap
      )}이며, 현재 경쟁 매물 최저가보다 ${formatGap(
        listingGap
      )}입니다.`,

    liquidity:
      `희망가 ${formatPrice(
        asking
      )}은 명백히 높은 가격으로 보기 어렵습니다. ` +
      `다만 단지 거래가 드물고, 동일 면적 거래 공백이 ${formatMonths(
        monthsSinceTrade
      )}입니다.`,

    exposure:
      `가격은 비교 기준에서 크게 벗어나지 않지만 등록 ${listedDays}일 동안 문의는 ${
        inquiries ?? 0
      }회였습니다. 실제 노출 상태를 먼저 확인할 필요가 있습니다.`,

    conversion:
      `누적 문의 ${
        inquiries ?? 0
      }회 중 실제 방문은 ${
        visits ?? 0
      }회였습니다. 방문 전 단계에서 반복되는 장애물이 있는지 확인할 필요가 있습니다.`,

    condition:
      visits === null
        ? "방문 횟수는 입력되지 않았지만 입력된 집 상태에서 현장 조건 신호가 확인됐습니다. 실제 방문 반응을 추가로 확인할 필요가 있습니다."
        : `실제 방문 ${visits}회 중 가격 협상으로 이어진 경우는 ${
            offers === null
              ? "미입력"
              : `${offers}회`
          }였습니다. 현장에서 매수 결정을 막는 조건이 있는지 확인할 필요가 있습니다.`,
  };

  return {
    cause,
    label: meta.label,
    headline:
      meta.headline,
    summary:
      summaryMap[cause],
    complex,
    apartmentName,
    area,

    askingPrice:
      formatPrice(asking),

    listedAt:
      dates.listedAt,

    reportId:
      dates.reportId,

    createdAt:
      dates.createdAt,

    dataDate:
      dates.createdAt,

    highlights: [
      {
        value:
          households === null
            ? "확인 필요"
            : `${households.toLocaleString(
                "ko-KR"
              )}세대`,
        label:
          "단지 규모",
      },
      {
        value:
          `최근 1년 ${transactions}건`,
        label:
          "단지 전체 거래",
      },
      {
        value:
          formatMonths(
            monthsSinceTrade
          ),
        label:
          "동일 면적 거래 공백",
      },
    ],

    evidence: [
      {
        number: "01",
        label: "거래량",

        title:
          transactions <= 1
            ? "매수자가 매우 드문 단지입니다."
            : "최근 거래량을 함께 봐야 합니다.",

        description:
          households !== null &&
          turnover !== null
            ? `전체 ${households.toLocaleString(
                "ko-KR"
              )}세대이며 최근 1년 단지 전체 매매는 ${transactions}건, 단순 회전율은 약 ${turnover.toFixed(
                1
              )}%입니다.`
            : `최근 1년 단지 전체 매매는 ${transactions}건입니다. 단지 세대수를 입력하면 단순 회전율도 함께 계산합니다.`,
      },

      {
        number: "02",
        label:
          "희망가격",

        title:
          priceConclusion(
            tradeGap,
            listingGap
          ),

        description:
          `최근 동일 면적 실거래는 ${formatPrice(
            lastTrade
          )}, 현재 공개 경쟁 매물 최저가는 ${formatPrice(
            lowestListing
          )}입니다.`,
      },

      {
        number: "03",
        label:
          "거래 공백",

        title:
          monthsSinceTrade >=
          12
            ? "동일 면적의 현재 체결가격이 충분히 검증되지 않았습니다."
            : "동일 면적의 최근 체결가격이 확인됩니다.",

        description:
          `동일 면적은 최근 거래 이후 ${formatMonths(
            monthsSinceTrade
          )}이 지났으며, 공개 매물 정보에는 중복 등록이 포함될 수 있습니다.`,
      },
    ],

    actionTitle:
      meta.actionTitle,

    actionDescription:
      meta.actionDescription,

    metrics: {
      askingPrice:
        asking,

      latestTradePrice:
        lastTrade,

      lowestListingPrice:
        lowestListing,

      tradeGapPercent:
        tradeGap,

      listingGapPercent:
        listingGap,

      complexTransactionCount12m:
        transactions,

      sameAreaTransactionCount12m:
        numberFrom(
          form,
          "sameAreaTransactions12m"
        ),

      monthsSinceLastTrade:
        monthsSinceTrade,

      households,
      listedDays,
      inquiries,
      visits,
      offers,
    },
  };
}

export default function DiagnosisForm() {
  const [
    result,
    setResult,
  ] =
    useState<Diagnosis | null>(
      null
    );

  const [
    pendingDiagnosis,
    setPendingDiagnosis,
  ] =
    useState<Diagnosis | null>(
      null
    );

  const [
    isPreparingPayment,
    setIsPreparingPayment,
  ] =
    useState(false);

  const [
    agreedToPaymentTerms,
    setAgreedToPaymentTerms,
  ] =
    useState(false);

  const [
    isOpeningPayment,
    setIsOpeningPayment,
  ] =
    useState(false);

  const [
    isGeneratingReport,
    setIsGeneratingReport,
  ] =
    useState(false);

  const [
    isLoadingAreas,
    setIsLoadingAreas,
  ] =
    useState(false);

  const [
    lookupError,
    setLookupError,
  ] =
    useState("");

  const [
    areaLookupError,
    setAreaLookupError,
  ] =
    useState("");

  const [
    areaLookupMessage,
    setAreaLookupMessage,
  ] =
    useState("");

  const [
    reportError,
    setReportError,
  ] =
    useState("");

  const [
    availableAreas,
    setAvailableAreas,
  ] =
    useState<number[]>([]);

  const [
    selectedExclusiveArea,
    setSelectedExclusiveArea,
  ] =
    useState("");

  const [
    selectedRegionName,
    setSelectedRegionName,
  ] =
    useState("");

  const [
    selectedDistrictCode,
    setSelectedDistrictCode,
  ] =
    useState("");

  const formRef =
    useRef<HTMLFormElement>(
      null
    );

  const resultRef =
    useRef<HTMLDivElement>(
      null
    );

  const paymentRef =
    useRef<HTMLDivElement>(
      null
    );

  const selectedRegion =
    REGIONS.find(
      (region) =>
        region.name ===
        selectedRegionName
    );

  function scrollToReport() {
    window.setTimeout(
      () =>
        resultRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        ),
      0
    );
  }

  function resetAreaOptions() {
    setAvailableAreas([]);
    setSelectedExclusiveArea(
      ""
    );
    setAreaLookupMessage("");
    setAreaLookupError("");
    setLookupError("");
    setReportError("");
    setPendingDiagnosis(null);
    setAgreedToPaymentTerms(false);
  }

  function editInputs() {
    setResult(null);
    setPendingDiagnosis(null);
    setAgreedToPaymentTerms(false);
    setReportError("");

    window.scrollTo({
      top:
        document.getElementById(
          "application"
        )?.offsetTop ?? 0,
      behavior: "smooth",
    });
  }

  async function loadExclusiveAreas() {
    if (!formRef.current) {
      return;
    }

    const form =
      new FormData(
        formRef.current
      );

    const lawdCd =
      String(
        form.get("lawdCd") ??
          ""
      ).trim();

    const legalDong =
      String(
        form.get(
          "legalDong"
        ) ?? ""
      ).trim();

    const apartmentName =
      String(
        form.get(
          "apartmentName"
        ) ?? ""
      ).trim();

    if (
      !selectedRegionName ||
      !lawdCd
    ) {
      setAreaLookupError(
        "시·도와 시군구를 선택해주세요."
      );
      return;
    }

    if (
      !legalDong ||
      !apartmentName
    ) {
      setAreaLookupError(
        "동과 아파트 단지명을 입력해주세요."
      );
      return;
    }

    const now =
      new Date();

    const endYmd =
      `${now.getFullYear()}` +
      `${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    setIsLoadingAreas(true);
    setAreaLookupError("");
    setAreaLookupMessage(
      "전용면적을 조회하고 있습니다. 최근 5년 공공데이터를 확인하므로 다소 시간이 걸릴 수 있습니다."
    );
    setAvailableAreas([]);
    setSelectedExclusiveArea(
      ""
    );

    try {
      const query =
        new URLSearchParams({
          mode: "areas",
          lawdCd,
          legalDong,
          apartmentName,
          endYmd,
          maxHistoryMonths:
            "60",
        });

      const response =
        await fetch(
          `/api/real-estate?${query.toString()}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as AreaLookupResult;

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "전용면적 조회에 실패했습니다."
        );
      }

      if (
        data.availableAreas
          .length === 0
      ) {
        throw new Error(
          "최근 5년 안에 입력한 동·단지명의 실거래를 찾지 못했습니다."
        );
      }

      const normalizedAreas =
        Array.from(
          new Set(
            data.availableAreas
              .filter(
                (area) =>
                  Number.isFinite(
                    area
                  ) &&
                  area > 0
              )
              .map((area) =>
                Math.floor(area)
              )
          )
        ).sort(
          (a, b) => a - b
        );

      setAvailableAreas(
        normalizedAreas
      );

      setAreaLookupMessage(
        `최근 5년 실거래에서 전용면적 ${normalizedAreas.length}개 유형을 찾았습니다. 소수점 이하는 생략해 표시합니다.`
      );
    } catch (error) {
      setAreaLookupError(
        error instanceof Error
          ? error.message
          : "전용면적 조회에 실패했습니다."
      );
    } finally {
      setIsLoadingAreas(
        false
      );
    }
  }

  async function submitDiagnosis(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formElement =
      event.currentTarget;

    const form =
      new FormData(
        formElement
      );

    const lawdCd =
      String(
        form.get("lawdCd") ??
          ""
      ).trim();

    const legalDong =
      String(
        form.get(
          "legalDong"
        ) ?? ""
      ).trim();

    const apartmentName =
      String(
        form.get(
          "apartmentName"
        ) ?? ""
      ).trim();

    const exclusiveArea =
      String(
        form.get(
          "exclusiveArea"
        ) ?? ""
      ).trim();

    const region =
      REGIONS.find(
        (item) =>
          item.name ===
          selectedRegionName
      );

    const district =
      region?.districts.find(
        ([code]) =>
          code === lawdCd
      );

    const now =
      new Date();

    const endYmd =
      `${now.getFullYear()}` +
      `${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    if (
      !region ||
      !district
    ) {
      setLookupError(
        "시·도와 시군구를 선택해주세요."
      );
      return;
    }

    setIsPreparingPayment(
      true
    );
    setLookupError("");
    setReportError("");
    setResult(null);
    setAgreedToPaymentTerms(false);

    try {
      const query =
        new URLSearchParams({
          lawdCd,
          legalDong,
          apartmentName,
          exclusiveArea,
          endYmd,
          months: "12",
          maxHistoryMonths:
            "60",
        });

      const response =
        await fetch(
          `/api/real-estate?${query.toString()}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as
          RealEstateSummary & {
            error?: string;
            detail?: string;
          };

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.error ||
            "실거래 조회에 실패했습니다."
        );
      }

      if (
        data.latestTradePrice ===
          null ||
        data.monthsSinceLastTrade ===
          null
      ) {
        throw new Error(
          "최근 5년 안에 동일 면적의 실거래를 찾지 못했습니다."
        );
      }

      form.set(
        "complex",
        `${region.name} ${district[1]} ${legalDong} ${apartmentName}`.trim()
      );

      form.set(
        "area",
        `전용 ${exclusiveArea}㎡`
      );

      form.set(
        "lastTradePrice",
        String(
          data.latestTradePrice
        )
      );

      form.set(
        "transactions12m",
        String(
          data.complexTransactionCount12m
        )
      );

      form.set(
        "sameAreaTransactions12m",
        String(
          data.sameAreaTransactionCount12m
        )
      );

      form.set(
        "monthsSinceTrade",
        String(
          data.monthsSinceLastTrade
        )
      );

      const diagnosis =
        buildDiagnosis(form);

      setPendingDiagnosis(
        diagnosis
      );

      window.setTimeout(
        () =>
          paymentRef.current?.scrollIntoView(
            {
              behavior:
                "smooth",
              block:
                "center",
            }
          ),
        50
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "실거래 조회에 실패했습니다.";

      setLookupError(
        message
      );
    } finally {
      setIsPreparingPayment(
        false
      );
    }
  }

  async function generateReport(
    diagnosis: Diagnosis
  ) {
    setIsGeneratingReport(
      true
    );
    setReportError("");
    setResult(null);

    try {
      const analysisResponse =
        await fetch(
          "/api/analysis",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                diagnosis,
              }),

            cache:
              "no-store",
          }
        );

      const analysisData =
        (await analysisResponse.json()) as AnalysisApiResponse;

      if (
        !analysisResponse.ok ||
        !analysisData.analysis
      ) {
        throw new Error(
          analysisData.detail ||
            analysisData.error ||
            "매도 분석 리포트 생성에 실패했습니다."
        );
      }

      const finalResult: Diagnosis =
        {
          ...diagnosis,
          aiDetailAnalysis:
            analysisData.analysis,
        };

      setResult(
        finalResult
      );
      setPendingDiagnosis(
        null
      );

      window.setTimeout(
        () =>
          resultRef.current?.scrollIntoView(
            {
              behavior:
                "smooth",
              block:
                "start",
            }
          ),
        50
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "매도 분석 리포트 생성에 실패했습니다.";

      setReportError(
        message
      );
    } finally {
      setIsGeneratingReport(
        false
      );
    }
  }

  async function continueAfterPayment() {
    if (
      !pendingDiagnosis ||
      !agreedToPaymentTerms ||
      isOpeningPayment
    ) {
      return;
    }

    const clientKey =
      process.env
        .NEXT_PUBLIC_TOSS_CLIENT_KEY;

    if (!clientKey) {
      setReportError(
        "토스페이먼츠 클라이언트 키가 설정되지 않았습니다."
      );
      return;
    }

    setIsOpeningPayment(true);
    setReportError("");

    try {
      await loadTossPaymentsSdk();

      if (
        !window.TossPayments
      ) {
        throw new Error(
          "토스페이먼츠 결제 모듈을 초기화하지 못했습니다."
        );
      }

      const orderId =
        createOrderId();

      const baseUrl =
        window.location.origin;

      sessionStorage.setItem(
        `whyunsold:order:${orderId}`,
        JSON.stringify({
          orderId,
          amount:
            REPORT_PRICE,
          diagnosis:
            pendingDiagnosis,
          createdAt:
            new Date().toISOString(),
        })
      );

      const tossPayments =
        window.TossPayments(
          clientKey
        );

      const widgets =
        tossPayments.widgets({
          customerKey:
            "ANONYMOUS",
        });

      await widgets.setAmount({
        value: REPORT_PRICE,
        currency: "KRW",
      });

      const paymentWindow =
        await widgets.renderPaymentWindow();

      paymentWindow.on(
        "paymentRequest",
        async () => {
          try {
            await widgets.requestPayment(
              {
                orderId,
                orderName:
                  "매도 분석 리포트",
                successUrl:
                  `${baseUrl}/payment/success`,
                failUrl:
                  `${baseUrl}/payment/fail`,
              }
            );
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "결제 요청에 실패했습니다.";

            setReportError(
              message
            );

            setIsOpeningPayment(
              false
            );
          }
        }
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "결제창을 열지 못했습니다.";

      setReportError(
        message
      );

      setIsOpeningPayment(
        false
      );
    }
  }

  return (
    <div className="diagnosis-form">
      <div className="form-heading">
        <p className="section-index">
          04 / 정보 입력
        </p>

        <div>
          <h2>
            매물 정보를 넣으면
            <br />
            분석 리포트가 완성됩니다.
          </h2>

          <p>
            공개 실거래 자료와 사용자가
            입력한 매도 상황을 함께
            분석합니다. 동·호수와 소유자
            정보는 받지 않습니다.
          </p>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={
          submitDiagnosis
        }
      >
        <div className="input-group">
          <div className="input-group-title">
            <span>01</span>

            <div>
              <strong>
                매물 기본정보
              </strong>

              <p>
                가격은 모두 만원
                단위로 입력하세요.
              </p>
            </div>
          </div>

          <div className="form-grid three-columns">
            <label>
              <span>
                시·도{" "}
                <em>필수</em>
              </span>

              <select
                required
                value={
                  selectedRegionName
                }
                onChange={(
                  event
                ) => {
                  setSelectedRegionName(
                    event.target
                      .value
                  );

                  setSelectedDistrictCode(
                    ""
                  );

                  resetAreaOptions();
                }}
              >
                <option
                  value=""
                  disabled
                >
                  시·도를
                  선택하세요
                </option>

                {REGIONS.map(
                  (region) => (
                    <option
                      value={
                        region.name
                      }
                      key={
                        region.name
                      }
                    >
                      {region.name}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                시군구{" "}
                <em>필수</em>
              </span>

              <select
                name="lawdCd"
                required
                value={
                  selectedDistrictCode
                }
                disabled={
                  !selectedRegion
                }
                onChange={(
                  event
                ) => {
                  setSelectedDistrictCode(
                    event.target
                      .value
                  );

                  resetAreaOptions();
                }}
              >
                <option
                  value=""
                  disabled
                >
                  {selectedRegion
                    ? "시군구를 선택하세요"
                    : "시·도를 먼저 선택하세요"}
                </option>

                {selectedRegion?.districts.map(
                  ([
                    code,
                    label,
                  ]) => (
                    <option
                      value={code}
                      key={code}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                동{" "}
                <em>필수</em>
              </span>

              <input
                name="legalDong"
                required
                placeholder="예: 잠실동"
                onChange={
                  resetAreaOptions
                }
              />
            </label>

            <label>
              <span>
                아파트 단지명{" "}
                <em>필수</em>
              </span>

              <input
                name="apartmentName"
                required
                placeholder="예: 리센츠"
                onChange={
                  resetAreaOptions
                }
              />
            </label>

            <label>
              <span>
                전용면적{" "}
                <em>필수</em>
              </span>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "minmax(0, 1fr) 88px",
                  gap: 8,
                }}
              >
                <div className="unit-input">
                  <input
                    name="exclusiveArea"
                    type="number"
                    min="1"
                    step="1"
                    required
                    list="exclusive-area-options"
                    value={
                      selectedExclusiveArea
                    }
                    placeholder="예: 84"
                    onChange={(
                      event
                    ) =>
                      setSelectedExclusiveArea(
                        event.target
                          .value
                      )
                    }
                  />

                  <b>㎡</b>

                  <datalist id="exclusive-area-options">
                    {availableAreas.map(
                      (area) => (
                        <option
                          value={String(
                            area
                          )}
                          key={area}
                        />
                      )
                    )}
                  </datalist>
                </div>

                <button
                  type="button"
                  disabled={
                    isLoadingAreas ||
                    !selectedDistrictCode ||
                    isGeneratingReport
                  }
                  onClick={
                    loadExclusiveAreas
                  }
                  style={{
                    minHeight: 50,
                    padding:
                      "0 10px",
                    border:
                      "1px solid #1c2922",
                    background:
                      "#fff",
                    color:
                      "#1c2922",
                    font:
                      "inherit",
                    fontSize: 12,
                    fontWeight:
                      800,

                    cursor:
                      isLoadingAreas ||
                      !selectedDistrictCode ||
                      isGeneratingReport
                        ? "not-allowed"
                        : "pointer",

                    opacity:
                      isLoadingAreas ||
                      !selectedDistrictCode ||
                      isGeneratingReport
                        ? 0.55
                        : 1,
                  }}
                >
                  {isLoadingAreas
                    ? "조회 중…"
                    : "불러오기"}
                </button>
              </div>

              <small
                style={{
                  display: "block",
                  marginTop: 8,
                  color: "#65726b",
                  fontSize: 12,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                전용면적을 알고 있다면 정수로 직접
                입력할 수 있습니다. 불러오기는 최근
                5년 공공데이터를 확인하므로 다소
                시간이 걸릴 수 있습니다.
              </small>
            </label>

            <label>
              <span>
                단지 세대수
                (선택)
              </span>

              <div className="unit-input">
                <input
                  name="households"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="모르면 비워두세요"
                />

                <b>세대</b>
              </div>
            </label>
          </div>

          {areaLookupError && (
            <p
              className="submit-note"
              role="alert"
            >
              전용면적 조회
              오류:{" "}
              {areaLookupError}
            </p>
          )}

          {areaLookupMessage && (
            <p className="submit-note">
              {areaLookupMessage}
            </p>
          )}
        </div>

        <div className="input-group">
          <div className="input-group-title">
            <span>02</span>

            <div>
              <strong>
                가격과 거래량
              </strong>

              <p>
                최근 실거래와 현재
                경쟁 매물을 기준으로
                비교합니다.
              </p>
            </div>
          </div>

          <div className="form-grid three-columns">
            <label>
              <span>
                희망 매도가{" "}
                <em>필수</em>
              </span>

              <div className="unit-input">
                <input
                  name="askingPrice"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="30000"
                />

                <b>만원</b>
              </div>
            </label>

            <label>
              <span>
                현재 경쟁매물
                최저가{" "}
                <em>필수</em>
              </span>

              <div className="unit-input">
                <input
                  name="lowestListingPrice"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="29800"
                />

                <b>만원</b>
              </div>
            </label>
          </div>

          <p className="submit-note">
            최근 동일면적
            실거래가, 최근 1년
            단지 전체 거래량,
            동일면적 거래 공백은
            국토교통부 실거래
            자료에서 자동으로
            조회합니다.
          </p>
        </div>

        <div className="input-group">
          <div className="input-group-title">
            <span>03</span>

            <div>
              <strong>
                문의와 방문 흐름
              </strong>

              <p>
                모르면 비워두고,
                실제 0회일 때만
                0을 입력하세요.
              </p>
            </div>
          </div>

          <div className="form-grid three-columns">
            <label>
              <span>
                매물 등록 기간{" "}
                <em>필수</em>
              </span>

              <div className="unit-input">
                <input
                  name="listedDays"
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="60"
                />

                <b>일</b>
              </div>
            </label>

            <label>
              <span>
                누적 문의
                (선택)
              </span>

              <div className="unit-input">
                <input
                  name="inquiries"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="모르면 비워두세요"
                />

                <b>회</b>
              </div>
            </label>

            <label>
              <span>
                실제 방문
                (선택)
              </span>

              <div className="unit-input">
                <input
                  name="visits"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="모르면 비워두세요"
                />

                <b>회</b>
              </div>
            </label>

            <label>
              <span>
                가격 제안·협상 진입
                (선택)
              </span>

              <div className="unit-input">
                <input
                  name="offers"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="모르면 비워두세요"
                />

                <b>회</b>
              </div>
            </label>

            <label>
              <span>
                집 내부 상태
                (선택)
              </span>

              <select
                name="condition"
                defaultValue="unknown"
              >
                <option value="unknown">
                  모름·판단 어려움
                </option>

                <option value="good">
                  수리 상태 양호
                </option>

                <option value="normal">
                  연식에 맞는 보통
                  상태
                </option>

                <option value="needs-repair">
                  눈에 띄는 수리
                  필요
                </option>
              </select>
            </label>
          </div>
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={
            isPreparingPayment ||
            isGeneratingReport ||
            isLoadingAreas
          }
        >
          {isPreparingPayment
            ? "실거래 자료 확인 중…"
            : "입력 정보 확인하기"}

          {!isPreparingPayment && (
            <span aria-hidden="true">
              →
            </span>
          )}
        </button>

        {lookupError && (
          <p
            className="submit-note"
            role="alert"
          >
            조회 오류:{" "}
            {lookupError}
          </p>
        )}

        {reportError && (
          <div
            className="after-submit"
            role="alert"
          >
            <strong>
              분석 리포트를
              생성하지 못했습니다.
            </strong>

            <p>
              {reportError}
            </p>
          </div>
        )}

        <p className="submit-note">
          먼저 공개 실거래 자료와
          입력 정보를 확인합니다.
          결제가 승인된 뒤 AI 기반
          분석 리포트를 생성합니다.
          거래 성사를 보장하지 않습니다.
        </p>
      </form>

      {pendingDiagnosis &&
        !isGeneratingReport && (
          <div
            ref={paymentRef}
            className="analysis-result"
            style={{
              marginTop: 40,
              paddingTop: 42,
              paddingBottom: 42,
            }}
          >
            <span className="result-kicker">
              PAYMENT
            </span>

            <h3>
              입력 정보와 실거래 자료를
              확인했습니다.
            </h3>

            <p className="result-summary">
              {pendingDiagnosis.complex}
              <br />
              {pendingDiagnosis.area} · 희망가{" "}
              {pendingDiagnosis.askingPrice}
            </p>

            <div
              style={{
                marginTop: 28,
                padding: "24px",
                border:
                  "1px solid #d7ddd8",
                background:
                  "#f8f8f3",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems:
                    "baseline",
                  justifyContent:
                    "space-between",
                  gap: 16,
                  flexWrap:
                    "wrap",
                }}
              >
                <strong
                  style={{
                    fontSize: 15,
                  }}
                >
                  매도 분석 리포트
                </strong>

                <strong
                  style={{
                    fontSize: 26,
                    letterSpacing:
                      "-0.03em",
                  }}
                >
                  20,000원
                </strong>
              </div>

              <p
                style={{
                  margin:
                    "12px 0 0",
                  color:
                    "#65726b",
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                결제가 완료되면 AI 분석을 시작하고
                매도 정체 원인, 가격 전략과 30일
                실행 계획을 포함한 리포트를 생성합니다.
              </p>
            </div>

            <label
              style={{
                display: "flex",
                alignItems:
                  "flex-start",
                gap: 10,
                marginTop: 22,
                fontSize: 13,
                lineHeight: 1.7,
                color:
                  "#4f5e56",
                cursor:
                  "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={
                  agreedToPaymentTerms
                }
                onChange={(
                  event
                ) =>
                  setAgreedToPaymentTerms(
                    event.target
                      .checked
                  )
                }
                style={{
                  marginTop: 4,
                }}
              />

              <span>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                >
                  이용약관
                </a>
                ,{" "}
                <a
                  href="/refund-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  환불정책
                </a>
                을 확인했으며, 결제 후 개인별
                리포트 생성이 시작되는 것에
                동의합니다.
              </span>
            </label>

            <button
              className="submit-button"
              type="button"
              disabled={
                !agreedToPaymentTerms ||
                isOpeningPayment
              }
              onClick={
                continueAfterPayment
              }
              style={{
                marginTop: 22,
                width: "100%",
              }}
            >
              {isOpeningPayment
                ? "결제창 여는 중…"
                : "20,000원 결제하고 리포트 만들기"}

              {!isOpeningPayment && (
                <span aria-hidden="true">
                  →
                </span>
              )}
            </button>

            <p
              className="submit-note"
              style={{
                marginTop: 14,
              }}
            >
              결제 인증이 완료되면 결제 금액을 서버에서
              다시 확인하고 승인한 뒤 AI 분석 리포트를
              생성합니다.
            </p>
          </div>
        )}

      {isGeneratingReport && (
        <div
          className="analysis-result"
          style={{
            textAlign:
              "center",
            paddingTop: 56,
            paddingBottom: 56,
          }}
        >
          <span className="result-kicker">
            ANALYSIS REPORT
          </span>

          <h3
            style={{
              marginLeft:
                "auto",
              marginRight:
                "auto",
            }}
          >
            매도 상황을 분석하고
            있습니다.
          </h3>

          <p
            className="result-summary"
            style={{
              marginLeft:
                "auto",
              marginRight:
                "auto",
            }}
          >
            실거래·가격 위치·거래
            유동성·문의와 방문
            흐름을 종합하여 매도
            정체 원인과 실행 전략을
            정리하고 있습니다.
          </p>
        </div>
      )}

      {result && (
        <div
          className="report-result-wrap"
          ref={resultRef}
          tabIndex={-1}
          aria-live="polite"
        >
          <DetailReport
            result={result}
            onBack={() => {}}
            onEdit={
              editInputs
            }
          />
        </div>
      )}
    </div>
  );
}