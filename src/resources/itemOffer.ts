// src/resources/itemOffer.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates item offer resource methods bound to the provided request context.
 */
export function itemOffer(ctx: RequestContext) {
  return {
    getById: (id: string, options?: RequestOptions): Promise<EndpointMap["itemOffer.getById"]["response"]> => {
      return ctx.request("itemOffer.getById", { id }, options?.cache);
    },
  };
}

export type ItemOfferResource = ReturnType<typeof itemOffer>;
