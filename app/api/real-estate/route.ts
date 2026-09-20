import { NextRequest, NextResponse } from "next/server";

const ENDPOINT =
  "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade";

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function readTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function readItems(xml: string) {
  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)).map(
    ([, item]) => ({
      apartmentName: readTag(item, "aptNm"),
      legalDong: readTag(item, "umdNm"),
      jibun: readTag(item, "jibun"),
      exclusiveArea: Number(readTag(item, "excluUseAr")),
      dealAmount: Number(readTag(item, "dealAmount").replace(/,/g, "")),
      dealYear: Number(readTag(item, "dealYear")),
      dealMonth: Number(readTag(item, "dealMonth")),
      dealDay: Number(readTag(item, "dealDay")),
      floor: Number(readTag(item, "floor")),
      buildYear: Number(readTag(item, "buildYear")),
    })
  );
}

function rawServiceKey(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeApartmentName(value: string) {
  return value.replace(/\s+/g, "").toLocaleLowerCase("ko-KR");
}

function normalizeLegalDong(value: string) {
  return value.replace(/\s+/g, "").toLocaleLowerCase("ko-KR");
}

function matchesExclusiveArea(
  actualArea: number,
  requestedArea: number
) {
  if (
    !Number.isFinite(actualArea) ||
    !Number.isFinite(requestedArea)
  ) {
    return false;
  }

  return (
    Math.floor(actualArea) ===
    Math.floor(requestedArea)
  );
}

function previousYearMonths(endYmd: string, count: number) {
  const year = Number(endYmd.slice(0, 4));
  const month = Number(endYmd.slice(4, 6));

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1 - index, 1));
    return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

function transactionDate(transaction: ReturnType<typeof readItems>[number]) {
  return new Date(
    Date.UTC(
      transaction.dealYear,
      transaction.dealMonth - 1,
      transaction.dealDay
    )
  );
}

function monthsBetween(from: Date, toYmd: string) {
  const toYear = Number(toYmd.slice(0, 4));
  const toMonth = Number(toYmd.slice(4, 6));

  return Math.max(
    0,
    (toYear - from.getUTCFullYear()) * 12 +
      (toMonth - 1 - from.getUTCMonth())
  );
}

async function fetchMonthlyTransactions(params: {
  serviceKey: string;
  lawdCd: string;
  dealYmd: string;
  useCache?: boolean;
}) {
  const searchParams = new URLSearchParams({
    serviceKey: rawServiceKey(params.serviceKey),
    LAWD_CD: params.lawdCd,
    DEAL_YMD: params.dealYmd,
    pageNo: "1",
    numOfRows: "9999",
  });

  const response = await fetch(`${ENDPOINT}?${searchParams.toString()}`, {
    ...(params.useCache
      ? { next: { revalidate: 3600 } }
      : { cache: "no-store" as const }),
  });

  const xml = await response.text();

  const resultCode =
    readTag(xml, "resultCode") || readTag(xml, "returnReasonCode");

  const resultMessage =
    readTag(xml, "resultMsg") ||
    readTag(xml, "returnAuthMsg") ||
    readTag(xml, "errMsg");

  if (
    !response.ok ||
    (resultCode && !["00", "000", "0000"].includes(resultCode))
  ) {
    throw new Error(
      resultMessage || `국토교통부 API 요청 실패 (${response.status})`
    );
  }

  return {
    xml,
    transactions: readItems(xml),
  };
}

// 같은 서버 인스턴스에서 단지 조회 직후 전용면적을 조회할 때,
// 이미 수집한 월별 실거래 목록을 다시 60개월 읽지 않도록 재사용합니다.
// 메모리 사용량을 제한하기 위해 최근 2개 지역/기간만 5분간 보관합니다.
const LOOKUP_HISTORY_TTL_MS = 5 * 60 * 1000;
const LOOKUP_HISTORY_MAX_ENTRIES = 2;
type LookupHistory = ReturnType<typeof readItems>;
type LookupHistoryCacheEntry = {
  expiresAt: number;
  promise: Promise<LookupHistory>;
};
const lookupHistoryCache = new Map<string, LookupHistoryCacheEntry>();

// 목록 조회에서는 월별 요청을 최대 8개씩 병렬 처리하고 1시간 캐시합니다.
// 월별 실거래 자료는 구 단위로 제공되므로, 동/단지 필터링은 이후에 수행합니다.
async function fetchLookupHistory(params: {
  serviceKey: string;
  lawdCd: string;
  yearMonths: string[];
}) {
  const cacheKey = `${params.lawdCd}:${params.yearMonths.join(",")}`;
  const now = Date.now();
  const cached = lookupHistoryCache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    // 최근 사용한 항목이 마지막에 오도록 순서를 갱신합니다.
    lookupHistoryCache.delete(cacheKey);
    lookupHistoryCache.set(cacheKey, cached);
    return cached.promise;
  }
  if (cached) lookupHistoryCache.delete(cacheKey);

  // 동일 조회가 동시에 들어오더라도 단 한 번만 외부 API를 호출합니다.
  // 각 월의 결과를 원래 순서대로 합쳐 기존 단지/전용면적 목록을 유지합니다.
  const promise = (async (): Promise<LookupHistory> => {
    const startedAt = Date.now();
    const history: LookupHistory = [];
    const concurrency = 8;
    let slowestMonth = "";
    let slowestMs = 0;

    try {
      for (let start = 0; start < params.yearMonths.length; start += concurrency) {
        const batch = params.yearMonths.slice(start, start + concurrency);
        const batchStartedAt = Date.now();
        const results = await Promise.all(
          batch.map(async (dealYmd) => {
            const monthStartedAt = Date.now();
            try {
              const result = await fetchMonthlyTransactions({
                serviceKey: params.serviceKey,
                lawdCd: params.lawdCd,
                dealYmd,
                useCache: true,
              });
              const elapsed = Date.now() - monthStartedAt;
              if (elapsed > slowestMs) {
                slowestMs = elapsed;
                slowestMonth = dealYmd;
              }
              return result.transactions;
            } catch (error) {
              throw new Error(
                `${dealYmd}: ${error instanceof Error ? error.message : "국토교통부 API 요청에 실패했습니다."}`
              );
            }
          })
        );

        for (const transactions of results) history.push(...transactions);
        console.info(
          `[real-estate lookup] district=${params.lawdCd} batch=${start / concurrency + 1} months=${batch.join(",")} durationMs=${Date.now() - batchStartedAt}`
        );
      }

      console.info(
        `[real-estate lookup] district=${params.lawdCd} months=${params.yearMonths.length} totalMs=${Date.now() - startedAt} slowestMonth=${slowestMonth} slowestMs=${slowestMs}`
      );
      return history;
    } catch (error) {
      console.error(
        `[real-estate lookup] district=${params.lawdCd} failedAfterMs=${Date.now() - startedAt}`
      );
      throw error;
    }
  })();

  const entry: LookupHistoryCacheEntry = {
    expiresAt: now + LOOKUP_HISTORY_TTL_MS,
    promise,
  };
  lookupHistoryCache.set(cacheKey, entry);
  while (lookupHistoryCache.size > LOOKUP_HISTORY_MAX_ENTRIES) {
    const oldestKey = lookupHistoryCache.keys().next().value;
    if (oldestKey === undefined) break;
    lookupHistoryCache.delete(oldestKey);
  }

  // 실패한 결과는 캐시에서 제거해서 다음 요청에 재시도할 수 있게 합니다.
  void promise.catch(() => {
    if (lookupHistoryCache.get(cacheKey) === entry) {
      lookupHistoryCache.delete(cacheKey);
    }
  });

  return promise;
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") ?? "summary";
  const lawdCd = request.nextUrl.searchParams.get("lawdCd") ?? "";
  const legalDong =
    request.nextUrl.searchParams.get("legalDong")?.trim() ?? "";
  const apartmentName =
    request.nextUrl.searchParams.get("apartmentName")?.trim() ?? "";
  const exclusiveAreaText =
    request.nextUrl.searchParams.get("exclusiveArea") ?? "";
  const endYmd =
    request.nextUrl.searchParams.get("endYmd") ??
    request.nextUrl.searchParams.get("dealYmd") ??
    "";
  const months = Number(request.nextUrl.searchParams.get("months") ?? "12");
  const maxHistoryMonths = Number(
    request.nextUrl.searchParams.get("maxHistoryMonths") ?? "60"
  );
  const exclusiveArea = Number(exclusiveAreaText);

  if (!/^\d{5}$/.test(lawdCd)) {
    return NextResponse.json(
      { error: "lawdCd는 법정동 코드 앞 5자리여야 합니다." },
      { status: 400 }
    );
  }

  if (!/^\d{6}$/.test(endYmd)) {
    return NextResponse.json(
      { error: "endYmd는 YYYYMM 형식의 조회 종료연월이어야 합니다." },
      { status: 400 }
    );
  }

  const endMonth = Number(endYmd.slice(4, 6));

  if (endMonth < 1 || endMonth > 12) {
    return NextResponse.json(
      { error: "endYmd의 월은 01부터 12까지여야 합니다." },
      { status: 400 }
    );
  }

  if (!["summary", "areas", "apartments"].includes(mode)) {
    return NextResponse.json(
      { error: "지원하지 않는 조회 mode입니다." },
      { status: 400 }
    );
  }

  if (mode !== "apartments" && !apartmentName) {
    return NextResponse.json(
      { error: "apartmentName을 입력해주세요." },
      { status: 400 }
    );
  }

  if (
    mode === "summary" &&
    (!Number.isFinite(exclusiveArea) || exclusiveArea <= 0)
  ) {
    return NextResponse.json(
      { error: "exclusiveArea는 0보다 큰 숫자여야 합니다." },
      { status: 400 }
    );
  }

  if (!Number.isInteger(months) || months < 1 || months > 24) {
    return NextResponse.json(
      { error: "months는 1부터 24까지의 정수여야 합니다." },
      { status: 400 }
    );
  }

  if (
    !Number.isInteger(maxHistoryMonths) ||
    maxHistoryMonths < months ||
    maxHistoryMonths > 60
  ) {
    return NextResponse.json(
      {
        error:
          "maxHistoryMonths는 months 이상 60 이하의 정수여야 합니다.",
      },
      { status: 400 }
    );
  }

  const serviceKey = process.env.MOLIT_API_KEY?.trim();

  if (!serviceKey) {
    return NextResponse.json(
      { error: ".env.local에서 MOLIT_API_KEY를 찾을 수 없습니다." },
      { status: 500 }
    );
  }

  try {
    const yearMonths = previousYearMonths(endYmd, maxHistoryMonths);
    const normalizedTargetName = normalizeApartmentName(apartmentName);
    const normalizedTargetDong = normalizeLegalDong(legalDong);

    if (mode === "apartments") {
      if (!normalizedTargetDong) {
        return NextResponse.json(
          { error: "legalDong을 입력해주세요." },
          { status: 400 }
        );
      }

      const apartmentMap = new Map<
        string,
        {
          apartmentName: string;
          latestDealYear: number;
          latestDealMonth: number;
          latestDealDay: number;
          transactionCount: number;
        }
      >();

      const transactions = await fetchLookupHistory({
        serviceKey,
        lawdCd,
        yearMonths,
      });

      for (const transaction of transactions) {
        if (
          normalizeLegalDong(transaction.legalDong) !==
          normalizedTargetDong
        ) {
          continue;
        }

        const apartmentNameValue = transaction.apartmentName.trim();

        if (!apartmentNameValue) {
          continue;
        }

        const key = normalizeApartmentName(apartmentNameValue);
        const existing = apartmentMap.get(key);

        if (!existing) {
          apartmentMap.set(key, {
            apartmentName: apartmentNameValue,
            latestDealYear: transaction.dealYear,
            latestDealMonth: transaction.dealMonth,
            latestDealDay: transaction.dealDay,
            transactionCount: 1,
          });
          continue;
        }

        existing.transactionCount += 1;

        const currentDate = new Date(
          Date.UTC(
            transaction.dealYear,
            transaction.dealMonth - 1,
            transaction.dealDay
          )
        );

        const existingDate = new Date(
          Date.UTC(
            existing.latestDealYear,
            existing.latestDealMonth - 1,
            existing.latestDealDay
          )
        );

        if (currentDate.getTime() > existingDate.getTime()) {
          existing.latestDealYear = transaction.dealYear;
          existing.latestDealMonth = transaction.dealMonth;
          existing.latestDealDay = transaction.dealDay;
          existing.apartmentName = apartmentNameValue;
        }
      }

      const apartments = Array.from(apartmentMap.values())
        .sort((left, right) => {
          const latestLeft = new Date(
            Date.UTC(
              left.latestDealYear,
              left.latestDealMonth - 1,
              left.latestDealDay
            )
          ).getTime();

          const latestRight = new Date(
            Date.UTC(
              right.latestDealYear,
              right.latestDealMonth - 1,
              right.latestDealDay
            )
          ).getTime();

          if (latestRight !== latestLeft) {
            return latestRight - latestLeft;
          }

          if (right.transactionCount !== left.transactionCount) {
            return right.transactionCount - left.transactionCount;
          }

          return left.apartmentName.localeCompare(
            right.apartmentName,
            "ko-KR"
          );
        })
        .map((item) => item.apartmentName);

      return NextResponse.json({
        lawdCd,
        legalDong,
        searchedMonths: yearMonths.length,
        apartmentCount: apartments.length,
        matchedTransactionCount: apartments.length,
        availableApartments: apartments,
        apartments,
      });
    }

    if (mode === "areas") {
      if (!normalizedTargetDong) {
        return NextResponse.json(
          { error: "legalDong을 입력해주세요." },
          { status: 400 }
        );
      }

      const availableAreaMap = new Map<string, number>();
      let matchedTransactionCount = 0;

      const transactions = await fetchLookupHistory({
        serviceKey,
        lawdCd,
        yearMonths,
      });

      const matchedTransactions = transactions.filter(
        (transaction) =>
          normalizeApartmentName(transaction.apartmentName) ===
            normalizedTargetName &&
          normalizeLegalDong(transaction.legalDong) === normalizedTargetDong
      );

      matchedTransactionCount += matchedTransactions.length;

      for (const transaction of matchedTransactions) {
        const area = transaction.exclusiveArea;

        if (Number.isFinite(area) && area > 0) {
          availableAreaMap.set(area.toFixed(4), area);
        }
      }

      const availableAreas = Array.from(availableAreaMap.values()).sort(
        (left, right) => left - right
      );

      return NextResponse.json({
        lawdCd,
        legalDong,
        apartmentName,
        searchedMonths: yearMonths.length,
        matchedTransactionCount,
        availableAreas,
      });
    }

    const complexTransactions12m: ReturnType<typeof readItems> = [];
    const sameAreaTransactions12m: ReturnType<typeof readItems> = [];
    const sameAreaHistoryTransactions: ReturnType<typeof readItems> = [];
    const searchedYearMonths: string[] = [];
    let districtTotalCount12m = 0;

    for (let index = 0; index < yearMonths.length; index += 1) {
      const dealYmd = yearMonths[index];

      let xml = "";
      let monthlyTransactions: ReturnType<typeof readItems>;

      try {
        const result = await fetchMonthlyTransactions({
          serviceKey,
          lawdCd,
          dealYmd,
        });

        xml = result.xml;
        monthlyTransactions = result.transactions;
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "국토교통부 API 요청에 실패했습니다.",
            failedYearMonth: dealYmd,
          },
          { status: 502 }
        );
      }

      searchedYearMonths.push(dealYmd);

      const monthlyComplexTransactions = monthlyTransactions.filter(
        (transaction) =>
          normalizeApartmentName(transaction.apartmentName) ===
            normalizedTargetName &&
          (!normalizedTargetDong ||
            normalizeLegalDong(transaction.legalDong) === normalizedTargetDong)
      );

      const monthlySameAreaTransactions = monthlyComplexTransactions.filter(
        (transaction) =>
          matchesExclusiveArea(transaction.exclusiveArea, exclusiveArea)
      );

      if (index < months) {
        districtTotalCount12m +=
          Number(readTag(xml, "totalCount")) || monthlyTransactions.length;

        complexTransactions12m.push(...monthlyComplexTransactions);
        sameAreaTransactions12m.push(...monthlySameAreaTransactions);
      }

      sameAreaHistoryTransactions.push(...monthlySameAreaTransactions);

      const foundDuringRecentPeriod =
        index === months - 1 && sameAreaHistoryTransactions.length > 0;

      const foundDuringOlderPeriod =
        index >= months && monthlySameAreaTransactions.length > 0;

      if (foundDuringRecentPeriod || foundDuringOlderPeriod) {
        break;
      }
    }

    const newestFirst = (
      left: ReturnType<typeof readItems>[number],
      right: ReturnType<typeof readItems>[number]
    ) => transactionDate(right).getTime() - transactionDate(left).getTime();

    complexTransactions12m.sort(newestFirst);
    sameAreaTransactions12m.sort(newestFirst);
    sameAreaHistoryTransactions.sort(newestFirst);

    const latestTransaction = sameAreaHistoryTransactions[0] ?? null;
    const recentFrom = yearMonths[months - 1];
    const historyFrom = searchedYearMonths.at(-1) ?? recentFrom;

    return NextResponse.json({
      lawdCd,
      legalDong,
      apartmentName,
      exclusiveArea,
      period: {
        recentFrom,
        to: yearMonths[0],
        recentMonths: months,
        historyFrom,
        searchedMonths: searchedYearMonths.length,
        maxHistoryMonths,
      },
      districtTotalCount12m,
      complexTransactionCount12m: complexTransactions12m.length,
      sameAreaTransactionCount12m: sameAreaTransactions12m.length,
      latestTransaction,
      latestTradePrice: latestTransaction?.dealAmount ?? null,
      monthsSinceLastTrade: latestTransaction
        ? monthsBetween(transactionDate(latestTransaction), endYmd)
        : null,
      complexTransactions12m,
      sameAreaTransactions12m,
      sameAreaHistoryTransactions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "국토교통부 API에 연결하지 못했습니다.",
        detail: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 502 }
    );
  }
}