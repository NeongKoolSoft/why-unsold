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

export default function PriceCheckForm() {
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

  async function loadAreas(
    selectedApartmentName: string
  ) {
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
          01 / 매도 전 가격 진단
        </p>

        <h1>
          내놓기 전,
          <br />
          희망가격의 위치를
          <br />
          확인하세요.
        </h1>

        <span>
          최근 동일 면적 실거래와
          단지 거래 흐름을 기준으로
          입력한 희망가격이 어느
          위치에 있는지 진단합니다.
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

          <div className="field-action">
            <input
              value={
                legalDong
              }
              onChange={(
                event
              ) => {
                setLegalDong(
                  event.target
                    .value
                );
                resetPropertySelection();
              }}
              placeholder="예: 잠실동"
            />

            <button
              type="button"
              onClick={
                loadApartments
              }
              disabled={
                isLoadingApartments
              }
            >
              {isLoadingApartments
                ? "단지 찾는 중…"
                : "입력한 동의 단지 찾기"}
            </button>
          </div>
        </label>

        <label className="full">
          <span>
            아파트 단지
          </span>

          <select
            value={
              apartmentName
            }
            disabled={
              apartments.length ===
              0
            }
            onChange={(
              event
            ) => {
              const nextApartmentName =
                event.target.value;

              setApartmentName(
                nextApartmentName
              );

              setAreas([]);
              setExclusiveArea("");
              setOrderData(null);

              if (
                nextApartmentName
              ) {
                void loadAreas(
                  nextApartmentName
                );
              }
            }}
          >
            <option value="">
              {apartments.length ===
              0
                ? "먼저 동의 단지를 찾아주세요"
                : "아파트 단지 선택"}
            </option>

            {apartments.map(
              (name) => (
                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>
              )
            )}
          </select>

          {isLoadingAreas ? (
            <small className="field-status">
              선택한 단지의
              전용면적을 불러오고
              있습니다.
            </small>
          ) : apartmentName &&
            areas.length > 0 ? (
            <small className="field-status success">
              전용면적{" "}
              {areas.length}개를
              불러왔습니다.
            </small>
          ) : null}
        </label>

        <label>
          <span>
            전용면적
          </span>

          <select
            value={
              exclusiveArea
            }
            disabled={
              areas.length ===
                0 ||
              isLoadingAreas
            }
            onChange={(
              event
            ) => {
              setExclusiveArea(
                event.target
                  .value
              );
              setOrderData(null);
            }}
          >
            <option value="">
              {isLoadingAreas
                ? "전용면적 불러오는 중…"
                : "전용면적 선택"}
            </option>

            {areas.map(
              (area) => (
                <option
                  key={area}
                  value={area}
                >
                  {formatArea(
                    area
                  )}
                  ㎡
                </option>
              )
            )}
          </select>
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
            : "가격 진단 준비하기"}
        </button>
      </form>

      {orderData ? (
      <PriceCheckPayment
          orderData={
          orderData
          }
      />
      ) : null}

      <style jsx>{`
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
      `}</style>
    </section>
  );
}