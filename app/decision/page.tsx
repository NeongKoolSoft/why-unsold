import DecisionForm from "./decision-form";

type DecisionPageProps = {
  searchParams: Promise<{
    regionName?: string;
    districtName?: string;
    lawdCd?: string;
    legalDong?: string;

    askingPrice?: string;
    referenceTradePrice?: string;
    recentTradeCount?: string;
    sameSizeTradeGapMonths?: string;
    apartmentName?: string;
    exclusiveArea?: string;
  }>;
};

export default async function DecisionPage({
  searchParams,
}: DecisionPageProps) {
  const params = await searchParams;

  return (
    <main>
      <DecisionForm
        regionName={params.regionName ?? ""}
        districtName={params.districtName ?? ""}
        lawdCd={params.lawdCd ?? ""}
        legalDong={params.legalDong ?? ""}
        askingPrice={params.askingPrice ?? ""}
        referenceTradePrice={
          params.referenceTradePrice ?? ""
        }
        recentTradeCount={
          params.recentTradeCount ?? ""
        }
        sameSizeTradeGapMonths={
          params.sameSizeTradeGapMonths ?? ""
        }
        apartmentName={
          params.apartmentName ?? ""
        }
        exclusiveArea={
          params.exclusiveArea ?? ""
        }
      />
    </main>
  );
}