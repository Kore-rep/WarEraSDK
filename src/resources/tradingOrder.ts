// src/resources/tradingOrder.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates trading order resource methods bound to the provided request context.
 */
export function tradingOrder(ctx: RequestContext) {
  return {
    getTopOrders: (): Promise<EndpointMap["tradingOrder.getTopOrders"]["response"]> => {
      return ctx.request("tradingOrder.getTopOrders", {});
    },
  };
}

export type TradingOrderResource = ReturnType<typeof tradingOrder>;
