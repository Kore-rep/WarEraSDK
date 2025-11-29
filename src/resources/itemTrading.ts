// src/resources/itemTrading.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates item trading resource methods bound to the provided request context.
 */
export function itemTrading(ctx: RequestContext) {
  return {
    getPrices: (): Promise<EndpointMap["itemTrading.getPrices"]["response"]> => {
      return ctx.request("itemTrading.getPrices", {});
    },
  };
}

export type ItemTradingResource = ReturnType<typeof itemTrading>;
