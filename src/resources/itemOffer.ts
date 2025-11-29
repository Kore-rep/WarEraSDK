// src/resources/itemOffer.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates item offer resource methods bound to the provided request context.
 */
export function itemOffer(ctx: RequestContext) {
  return {
    getById: (id: string): Promise<EndpointMap["itemOffer.getById"]["response"]> => {
      return ctx.request("itemOffer.getById", { id });
    },
  };
}

export type ItemOfferResource = ReturnType<typeof itemOffer>;
