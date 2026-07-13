// src/resources/tradingOrder.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates trading order resource methods bound to the provided request context.
 */
export function tradingOrder(ctx: RequestContext) {
  return {
    getTopOrders: (options?: RequestOptions): Promise<EndpointMap["tradingOrder.getTopOrders"]["response"]> => {
      return ctx.request("tradingOrder.getTopOrders", {}, options?.cache);
    },
  };
}

export type TradingOrderResource = ReturnType<typeof tradingOrder>;
