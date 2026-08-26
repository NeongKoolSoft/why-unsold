import {
  EXECUTION_STRATEGY_PRODUCT_CODE,
} from "../execution-strategy-types";

export const EXECUTION_STRATEGY_PRODUCT = {
  code:
    EXECUTION_STRATEGY_PRODUCT_CODE,

  price:
    19900,

  paymentPrefix:
    "WHYUNSOLD-STRATEGY-",

  orderName:
    "30일 매도 실행전략",
} as const;