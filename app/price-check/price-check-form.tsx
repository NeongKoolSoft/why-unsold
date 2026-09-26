"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import {
  REGIONS,
} from "../diagnosis-form";

import type {
  PriceCheckOrderData,
  PriceCheckTransaction,
} from "../price-check-types";

import PriceCheckPayment from "./price-check-payment";

type ApartmentLookupResult = {
  availableApartments?: string[];
  error?: string;
  detail?: string;
};

type AreaLookupResult = {
  availableAreas?: number[];
  error?: string;
  detail?: string;
};

type RealEstateSummary = {
  districtTotalCount12m: number;
  complexTransactionCount12m: number;
  sameAreaTransactionCount12m: number;
  latestTradePrice: number | null;
  monthsSinceLastTrade: number | null;

  latestTransaction:
    | PriceCheckTransaction
    | null;

  sameAreaTransactions12m:
    PriceCheckTransaction[];

  error?: string;
  detail?: string;
};

function currentYearMonth() {
  const now = new Date();

  return `${now.getFullYear()}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

function currentDate() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(
      now.getMonth() + 1
    ).padStart(2, "0"),
    String(
      now.getDate()
    ).padStart(2, "0"),
  ].join("-");
}

function formatArea(
  area: number
) {
  return Number.isInteger(area)
    ? String(area)
    : area.toFixed(2);
}

function trackGaEvent(
  eventName: string,
  params?: Record<
    string,
    string | number
  >
) {
  const analyticsWindow =
    window as typeof window & {
      gtag?: (
        command: "event",
        eventName: string,
        params?: Record<
          string,
          string | number
        >
      ) => void;
    };

  if (
    typeof analyticsWindow.gtag !==
    "function"
  ) {
    return;
  }

  analyticsWindow.gtag(
    "event",
    eventName,
    params
  );
}

export default function PriceCheckForm({
  freeMode = false,
}: {
  freeMode?: boolean;
}) {
  const [
    regionName,
    setRegionName,
  ] = useState("");

  const [
    lawdCd,
    setLawdCd,
  ] = useState("");

  const [
    legalDong,
    setLegalDong,
  ] = useState("");

  const [
    apartmentName,
    setApartmentName,
  ] = useState("");

  const [
    exclusiveArea,
    setExclusiveArea,
  ] = useState("");

  const [
    isManualAreaInput,
    setIsManualAreaInput,
  ] = useState(true);

  const [
    askingPrice,
    setAskingPrice,
  ] = useState("");

  const [
    apartments,
    setApartments,
  ] = useState<string[]>(
    []
  );

  const [
    areas,
    setAreas,
  ] = useState<number[]>(
    []
  );

  const [
    isLoadingApartments,
    setIsLoadingApartments,
  ] = useState(false);

  const [
    isLoadingAreas,
    setIsLoadingAreas,
  ] = useState(false);

  const [
    isChecking,
    setIsChecking,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    orderData,
    setOrderData,
  ] =
    useState<PriceCheckOrderData | null>(
      null
    );

  const selectedRegion =
    useMemo(
      () =>
        REGIONS.find(
          (region) =>
            region.name ===
            regionName
        ) ?? null,
      [regionName]
    );

  const districtName =
    selectedRegion?.districts.find(
      ([code]) =>
        code === lawdCd
    )?.[1] ?? "";

  function resetPropertySelection() {
    setApartments([]);
    setAreas([]);
    setApartmentName("");
    setExclusiveArea("");
    setOrderData(null);
  }

  async function loadApartments() {
    if (
      !lawdCd ||
      !legalDong.trim()
    ) {
      setError(
        "시·군·구와 동을 입력해주세요."
      );
      return;
    }

    setError("");
    setIsLoadingApartments(
      true
    );
    setApartments([]);
    setAreas([]);
    setApartmentName("");
    setExclusiveArea("");
    setOrderData(null);

    try {
      const params =
        new URLSearchParams({
          mode: "apartments",
          lawdCd,
          legalDong:
            legalDong.trim(),
          endYmd:
            currentYearMonth(),
          months: "12",
          maxHistoryMonths:
            "60",
        });

      const response =
        await fetch(
          `/api/real-estate?${params.toString()}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as ApartmentLookupResult;

      if (
        !response.ok
      ) {
        throw new Error(
          data.detail ||
            data.error ||
            "단지 목록을 불러오지 못했습니다."
        );
      }

      const availableApartments =
        [
          ...(
            data.availableApartments ??
            []
          ),
        ].sort(
          (
            left,
            right
          ) =>
            left.localeCompare(
              right,
              "ko-KR",
              {
                numeric: true,
                sensitivity:
                  "base",
              }
            )
        );

      if (
        availableApartments.length ===
        0
      ) {
        throw new Error(
          "최근 거래 자료에서 해당 동의 아파트 단지를 찾지 못했습니다."
        );
      }

      setApartments(
        availableApartments
      );
    } catch (
      loadError
    ) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "단지 목록 조회 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoadingApartments(
        false
      );
    }
  }

  async function loadAreas() {
    const selectedApartmentName =
      apartmentName.trim();
    if (
      !lawdCd ||
      !legalDong.trim() ||
      !selectedApartmentName
    ) {
      setError(
        "조회할 아파트 단지를 선택해주세요."
      );
      return;
    }

    setError("");
    setIsLoadingAreas(true);
    setAreas([]);
    setExclusiveArea("");
    setOrderData(null);

    try {
      const params =
        new URLSearchParams({
          mode: "areas",
          lawdCd,
          legalDong:
            legalDong.trim(),
          apartmentName:
            selectedApartmentName,
          endYmd:
            currentYearMonth(),
          months: "12",
          maxHistoryMonths:
            "60",
        });

      const response =
        await fetch(
          `/api/real-estate?${params.toString()}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as AreaLookupResult;

      if (
        !response.ok
      ) {
        throw new Error(
          data.detail ||
            data.error ||
            "전용면적 목록을 불러오지 못했습니다."
        );
      }

      const availableAreas =
        data.availableAreas ??
        [];

      if (
        availableAreas.length ===
        0
      ) {
        throw new Error(
          "해당 단지의 전용면적 거래 자료를 찾지 못했습니다."
        );
      }

      setAreas(
        availableAreas
      );
      setExclusiveArea("");
      setIsManualAreaInput(false);
    } catch (
      loadError
    ) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "전용면적 조회 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoadingAreas(
        false
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericArea =
      Number(exclusiveArea);

    const numericAskingPrice =
      Number(askingPrice);

    if (
      !regionName ||
      !lawdCd ||
      !districtName ||
      !legalDong.trim() ||
      !apartmentName ||
      !Number.isFinite(
        numericArea
      ) ||
      numericArea <= 0 ||
      !Number.isFinite(
        numericAskingPrice
      ) ||
      numericAskingPrice <= 0
    ) {
      setError(
        "모든 필수 정보를 정확하게 입력해주세요."
      );
      return;
    }

    trackGaEvent(
      freeMode ? "free_price_check_start" : "price_check_start",
      {
        item_id:
          "PRICE_CHECK",
        item_name:
          freeMode ? "무료 가격 확인" : "매도 전 가격 진단",
        region:
          regionName,
        district:
          districtName,
      }
    );

    setError("");
    setOrderData(null);
    setIsChecking(true);

    try {
      const params =
        new URLSearchParams({
          mode: "summary",
          lawdCd,
          legalDong:
            legalDong.trim(),
          apartmentName,
          exclusiveArea:
            String(
              numericArea
            ),
          endYmd:
            currentYearMonth(),
          months: "12",
          maxHistoryMonths:
            "60",
        });

      const response =
        await fetch(
          `/api/real-estate?${params.toString()}`,
          {
            cache:
              "no-store",
          }
        );

      const data =
        (await response.json()) as RealEstateSummary;

      if (
        !response.ok
      ) {
        throw new Error(
          data.detail ||
            data.error ||
            "실거래 자료를 확인하지 못했습니다."
        );
      }

      if (
        data.latestTradePrice ===
          null ||
        !data.latestTransaction
      ) {
        throw new Error(
          "최근 5년 이내 동일 면적 실거래가 없어 현재 가격 위치를 진단하기 어렵습니다."
        );
      }

      const nextOrderData: PriceCheckOrderData =
        {
          productId:
            "price-check",

          property: {
            regionName,
            districtName,
            lawdCd,
            legalDong:
              legalDong.trim(),
            apartmentName,
            exclusiveArea:
              numericArea,
            askingPrice:
              numericAskingPrice,
          },

          market: {
            dataDate:
              currentDate(),

            districtTotalCount12m:
              data.districtTotalCount12m,

            complexTransactionCount12m:
              data.complexTransactionCount12m,

            sameAreaTransactionCount12m:
              data.sameAreaTransactionCount12m,

            latestTradePrice:
              data.latestTradePrice,

            monthsSinceLastTrade:
              data.monthsSinceLastTrade,

            latestTransaction:
              data.latestTransaction,

            sameAreaTransactions12m:
              data.sameAreaTransactions12m ??
              [],
          },
        };

      setOrderData(
        nextOrderData
      );
    } catch (
      checkError
    ) {
      setError(
        checkError instanceof Error
          ? checkError.message
          : "가격 자료 확인 중 오류가 발생했습니다."
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <section className="price-check-form-shell">
      <div className="price-check-form-heading">
        <p>
          {freeMode ? "무료 / 가격 확인" : "01 / 매도 전 가격 진단"}
        </p>

        <h1>
          {freeMode ? (
            <>내 아파트 가격을<br />실거래와 비교해 보세요.</>
          ) : (
            <>내놓기 전,<br />희망가격의 위치를<br />확인하세요.</>
          )}
        </h1>

        <span>
          {freeMode
            ? "최근 동일 면적 실거래와 입력한 희망가격의 차이를 무료로 확인합니다. 개별 세대의 적정 가격이나 매도 정체 원인을 판단하는 결과는 아닙니다."
            : "최근 동일 면적 실거래와 단지 거래 흐름을 기준으로 입력한 희망가격이 어느 위치에 있는지 진단합니다."}
        </span>
      </div>

      <form
        className="price-check-form"
        onSubmit={
          handleSubmit
        }
      >
        <label>
          <span>시·도</span>

          <select
            value={
              regionName
            }
            onChange={(
              event
            ) => {
              setRegionName(
                event.target
                  .value
              );
              setLawdCd("");
              setLegalDong("");
              resetPropertySelection();
            }}
          >
            <option value="">
              시·도 선택
            </option>

            {REGIONS.map(
              (region) => (
                <option
                  key={
                    region.name
                  }
                  value={
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
            시·군·구
          </span>

          <select
            value={lawdCd}
            disabled={
              !selectedRegion
            }
            onChange={(
              event
            ) => {
              setLawdCd(
                event.target
                  .value
              );
              setLegalDong("");
              resetPropertySelection();
            }}
          >
            <option value="">
              시·군·구 선택
            </option>

            {selectedRegion?.districts.map(
              ([
                code,
                name,
              ]) => (
                <option
                  key={code}
                  value={code}
                >
                  {name}
                </option>
              )
            )}
          </select>
        </label>

        <label className="full">
          <span>동</span>

          <input
            value={legalDong}
            onChange={(event) => {
              setLegalDong(
                event.target.value
              );
              resetPropertySelection();
            }}
            placeholder="예: 잠실동"
          />
        </label>

        <label className="full">
          <span>
            아파트 단지
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 88px",
              gap: 8,
            }}
          >
            {apartments.length > 0 ? (
              <select
                value={apartmentName}
                onChange={(event) => {
                  setApartmentName(
                    event.target.value
                  );
                  setAreas([]);
                  setExclusiveArea("");
                  setIsManualAreaInput(true);
                  setOrderData(null);
                }}
              >
                <option value="" disabled>
                  아파트 단지를 선택하세요
                </option>

                {apartments.map((name) => (
                  <option
                    key={name}
                    value={name}
                  >
                    {name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={apartmentName}
                onChange={(event) => {
                  setApartmentName(
                    event.target.value
                  );
                  setAreas([]);
                  setExclusiveArea("");
                  setIsManualAreaInput(true);
                  setOrderData(null);
                }}
                placeholder="예: 리센츠"
              />
            )}

            <button
              type="button"
              onClick={loadApartments}
              disabled={
                isLoadingApartments ||
                !lawdCd ||
                !legalDong.trim()
              }
              className="lookup-button"
            >
              {isLoadingApartments
                ? "조회 중…"
                : "단지 불러오기"}
            </button>
          </div>

          <small className="field-status">
            {apartments.length > 0
              ? "조회된 단지 목록에서 선택해주세요. 단지를 다시 조회하려면 동을 수정한 뒤 단지 불러오기를 눌러주세요."
              : "단지명을 알고 있다면 직접 입력할 수 있습니다. 단지 불러오기를 누르면 조회된 단지를 선택 목록으로 제공합니다."}
          </small>
        </label>

        <label>
          <span>
            전용면적
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 88px",
              gap: 8,
            }}
          >
            <div className="unit-input">
              {!isManualAreaInput &&
              areas.length > 0 ? (
                <select
                  required
                  value={exclusiveArea}
                  disabled={isLoadingAreas}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    if (
                      value === "__manual__"
                    ) {
                      setExclusiveArea("");
                      setIsManualAreaInput(true);
                      return;
                    }

                    setExclusiveArea(value);
                    setOrderData(null);
                  }}
                >
                  <option value="" disabled>
                    전용면적을 선택하세요
                  </option>

                  {areas.map((area) => (
                    <option
                      key={area}
                      value={String(area)}
                    >
                      {formatArea(area)}㎡
                    </option>
                  ))}

                  <option value="__manual__">
                    직접 입력하기
                  </option>
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]+"
                    required
                    value={exclusiveArea}
                    placeholder="예: 84"
                    onChange={(event) => {
                      setExclusiveArea(
                        event.target.value.replace(
                          /[^0-9]/g,
                          ""
                        )
                      );
                      setOrderData(null);
                    }}
                  />
                  <b>㎡</b>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={loadAreas}
              disabled={
                isLoadingAreas ||
                !lawdCd ||
                !legalDong.trim() ||
                !apartmentName.trim()
              }
              className="lookup-button"
            >
              {isLoadingAreas
                ? "조회 중…"
                : "불러오기"}
            </button>
          </div>

          <small className="field-status">
            전용면적을 알고 있다면 정수로 직접 입력할 수 있습니다. 불러오기는 최근 5년 공공데이터를 확인하므로 다소 시간이 걸릴 수 있습니다.
          </small>
        </label>

        <label>
          <span>
            희망가격
          </span>

          <div className="price-input">
            <input
              type="number"
              min="1"
              step="1"
              value={
                askingPrice
              }
              onChange={(
                event
              ) => {
                setAskingPrice(
                  event.target
                    .value
                );
                setOrderData(null);
              }}
              placeholder="예: 36000"
            />

            <strong>
              만원
            </strong>
          </div>
        </label>

        {error ? (
          <p className="form-error">
            {error}
          </p>
        ) : null}

        <button
          className="check-button"
          type="submit"
          disabled={
            isChecking ||
            isLoadingApartments ||
            isLoadingAreas
          }
        >
          {isChecking
            ? "가격 자료 확인 중…"
            : freeMode ? "무료로 가격 차이 확인하기" : "가격 진단 준비하기"}
        </button>
      </form>

      {orderData && freeMode ? (
        <section className="free-price-result" aria-live="polite">
          <p className="result-kicker">무료 가격 확인 결과</p>
          <h2>{apartmentName} · 전용 {formatArea(Number(exclusiveArea))}㎡</h2>
          <div className="result-values">
            <div>
              <span>입력한 희망가격</span>
              <strong>{Number(askingPrice).toLocaleString("ko-KR")}만원</strong>
            </div>
            <div>
              <span>최근 동일 면적 실거래</span>
              <strong>{orderData.market.latestTradePrice?.toLocaleString("ko-KR")}만원</strong>
            </div>
            <div>
              <span>실거래와의 차이</span>
              <strong>
                {Number(askingPrice) - (orderData.market.latestTradePrice ?? 0) >= 0 ? "+" : "−"}
                {Math.abs(Number(askingPrice) - (orderData.market.latestTradePrice ?? 0)).toLocaleString("ko-KR")}만원
              </strong>
            </div>
          </div>
          <p className="result-limit">
            최근 실거래 한 건과의 단순 차이입니다.
            마지막 동일 면적 거래 이후 {orderData.market.monthsSinceLastTrade ?? "확인되지 않은"}개월이 지났습니다.
            거래 시점, 층·향·수리 상태,
            현재 경쟁 매물 가격은 반영하지 않았습니다. 최근 실거래가 현재 시세나
            적정 매도가를 뜻하지는 않습니다.
          </p>
          <a className="result-link" href="/diagnosis">
            매도 중이라면 정체 원인 진단하기 (9,900원) →
          </a>
        </section>
      ) : orderData ? (
        <PriceCheckPayment orderData={orderData} />
      ) : null}

      <style jsx>{`
        .free-price-result {
          width: min(900px, 100%);
          margin: 42px 0 0 auto;
          padding: 28px;
          border: 1px solid var(--ink);
          background: var(--white);
        }
        .free-price-result .result-kicker {
          color: var(--green);
          font-size: 13px;
          font-weight: 800;
        }
        .free-price-result h2 { margin: 8px 0 24px; font-size: 24px; }
        .result-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .result-values div { padding: 16px; background: var(--warm); }
        .result-values span { display: block; font-size: 12px; margin-bottom: 8px; }
        .result-values strong { font-size: 18px; word-break: keep-all; }
        .result-limit { margin: 22px 0; font-size: 13px; line-height: 1.7; color: #626b66; }
        .result-link { display: inline-block; padding: 14px 18px; color: white; background: var(--green); font-weight: 700; text-decoration: none; }
        @media (max-width: 680px) {
          .free-price-result { padding: 20px; }
          .result-values { grid-template-columns: 1fr; }
        }
        .price-check-form-shell {
          width: min(
            1240px,
            calc(100% - 48px)
          );
          margin: 0 auto;
          padding: 94px 0 120px;
          color: var(--ink);
        }

        .price-check-form-heading {
          display: grid;
          grid-template-columns:
            1fr 2fr;
          gap: 18px 40px;
          margin-bottom: 64px;
        }

        .price-check-form-heading p {
          grid-column: 1;
          grid-row: 1;
          margin: 9px 0 0;
          color: var(--green);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .price-check-form-heading h1 {
          grid-column: 2;
          grid-row: 1;
          margin: 0;
          font-size: clamp(
            46px,
            5vw,
            68px
          );
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.065em;
        }

        .price-check-form-heading span {
          grid-column: 2;
          display: block;
          max-width: 670px;
          color: #626b66;
          font-size: 16px;
          line-height: 1.85;
          word-break: keep-all;
        }

        .price-check-form {
          width: min(
            900px,
            100%
          );
          margin-left: auto;
          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );
          gap: 26px 18px;
          padding: 52px;
          border: 1px solid
            var(--ink);
          background:
            var(--white);
          box-shadow:
            14px 14px 0
            var(--warm);
        }

        label {
          display: grid;
          align-content: start;
          gap: 10px;
        }

        label.full {
          grid-column: 1 / -1;
        }

        label > span {
          font-size: 12px;
          font-weight: 800;
        }

        input,
        select,
        button {
          min-height: 52px;
          border-radius: 0;
          font: inherit;
        }

        input,
        select {
          width: 100%;
          padding: 0 15px;
          border: 1px solid
            #c9d0cb;
          background: #fbfcfb;
          color: var(--ink);
          font-size: 14px;
          outline: 0;
        }

        input:focus,
        select:focus {
          border-color:
            var(--green);
          box-shadow:
            0 0 0 2px
            rgba(
              12,
              91,
              66,
              0.09
            );
        }

        input:disabled,
        select:disabled {
          background:
            #f1f3f1;
          color: #909893;
          cursor: not-allowed;
        }

        .lookup-button {
          min-height: 52px;
          padding: 0 10px;
          border: 1px solid var(--ink);
          background: #fff;
          color: var(--ink);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .lookup-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .field-action {
          display: grid;
          grid-template-columns:
            1fr;
          gap: 10px;
        }

        .field-action button {
          width: 100%;
          padding: 0 20px;
          border: 1px solid
            var(--green);
          background:
            var(--mint-soft);
          color:
            var(--green);
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .field-action button:hover:not(
            :disabled
          ) {
          background:
            var(--mint);
        }

        .field-action button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .field-status {
          color: #717a75;
          font-size: 11px;
          line-height: 1.5;
        }

        .field-status.success {
          color:
            var(--green);
          font-weight: 700;
        }

        .price-input {
          position: relative;
        }

        .price-input input {
          padding-right: 62px;
        }

        .price-input strong {
          position: absolute;
          top: 50%;
          right: 15px;
          transform:
            translateY(-50%);
          color: #5f6863;
          font-size: 11px;
        }

        .form-error {
          grid-column: 1 / -1;
          margin: 0;
          padding: 15px 17px;
          border-left: 4px solid
            #a33a2b;
          background: #fff2ef;
          color: #8b3024;
          font-size: 12px;
          line-height: 1.65;
        }

        .check-button {
          grid-column: 1 / -1;
          width: 100%;
          min-height: 60px;
          margin-top: 5px;
          padding: 0 22px;
          border: 0;
          background:
            var(--green);
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .check-button:hover:not(
            :disabled
          ) {
          background:
            var(--green-deep);
        }

        .check-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (
          max-width: 900px
        ) {
          .price-check-form-heading {
            grid-template-columns:
              1fr;
            gap: 20px;
          }

          .price-check-form-heading p,
          .price-check-form-heading h1,
          .price-check-form-heading span {
            grid-column: 1;
            grid-row: auto;
          }

          .price-check-form {
            width: 100%;
            margin-left: 0;
          }

          .payment-ready {
            width: 100%;
            margin-left: 0;
          }
        }

        @media (
          max-width: 680px
        ) {
          .price-check-form-shell {
            width: min(
              100% - 32px,
              1240px
            );
            padding: 64px 0 82px;
          }

          .price-check-form-heading {
            margin-bottom: 42px;
          }

          .price-check-form-heading h1 {
            font-size: 43px;
          }

          .price-check-form-heading span {
            font-size: 14px;
          }

          .price-check-form {
            grid-template-columns:
              1fr;
            padding: 30px 21px;
            box-shadow:
              8px 8px 0
              var(--warm);
          }

          label.full,
          .form-error,
          .check-button {
            grid-column: auto;
          }

          .payment-ready {
            padding: 25px 21px;
          }
        }

        @media (max-width: 680px) {
          .price-check-form-heading h1 {
            font-size: 34px;
            line-height: 1.2;
          }
        }
      `}</style>
    </section>
  );
}
