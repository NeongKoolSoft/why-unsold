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

function matchesExclusiveArea(actualArea: number, requestedArea: number) {
  if (Number.isInteger(requestedArea)) {
    return Math.floor(actualArea) === requestedArea;
  }

  return Math.abs(actualArea - requestedArea) <= 0.1;
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
}) {
  const searchParams = new URLSearchParams({
    serviceKey: rawServiceKey(params.serviceKey),
    LAWD_CD: params.lawdCd,
    DEAL_YMD: params.dealYmd,
    pageNo: "1",
    numOfRows: "9999",
  });

  const response = await fetch(`${ENDPOINT}?${searchParams.toString()}`, {
    cache: "no-store",
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

      for (const dealYmd of yearMonths) {
        let transactions: ReturnType<typeof readItems>;

        try {
          ({ transactions } = await fetchMonthlyTransactions({
            serviceKey,
            lawdCd,
            dealYmd,
          }));
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

      for (const dealYmd of yearMonths) {
        let transactions: ReturnType<typeof readItems>;

        try {
          ({ transactions } = await fetchMonthlyTransactions({
            serviceKey,
            lawdCd,
            dealYmd,
          }));
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