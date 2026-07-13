// src/resources/workOffer.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates work offer resource methods bound to the provided request context.
 */
export function workOffer(ctx: RequestContext) {
  return {
    getById: (id: string, options?: RequestOptions): Promise<EndpointMap["workOffer.getById"]["response"]> => {
      return ctx.request("workOffer.getById", { id }, options?.cache);
    },
    getWorkOfferByCompanyId: (
      companyId: string, options?: RequestOptions): Promise<EndpointMap["workOffer.getWorkOfferByCompanyId"]["response"]> => {
      return ctx.request("workOffer.getWorkOfferByCompanyId", { companyId }, options?.cache);
    },
    getWorkOffersPaginated: (
      page: number,
      limit: number, options?: RequestOptions): Promise<EndpointMap["workOffer.getWorkOffersPaginated"]["response"]> => {
      return ctx.request("workOffer.getWorkOffersPaginated", { page, limit }, options?.cache);
    },
  };
}

export type WorkOfferResource = ReturnType<typeof workOffer>;
