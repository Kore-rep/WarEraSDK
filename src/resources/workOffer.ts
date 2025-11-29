// src/resources/workOffer.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates work offer resource methods bound to the provided request context.
 */
export function workOffer(ctx: RequestContext) {
  return {
    getById: (id: string): Promise<EndpointMap["workOffer.getById"]["response"]> => {
      return ctx.request("workOffer.getById", { id });
    },
    getWorkOfferByCompanyId: (
      companyId: string
    ): Promise<EndpointMap["workOffer.getWorkOfferByCompanyId"]["response"]> => {
      return ctx.request("workOffer.getWorkOfferByCompanyId", { companyId });
    },
    getWorkOffersPaginated: (
      page: number,
      limit: number
    ): Promise<EndpointMap["workOffer.getWorkOffersPaginated"]["response"]> => {
      return ctx.request("workOffer.getWorkOffersPaginated", { page, limit });
    },
  };
}

export type WorkOfferResource = ReturnType<typeof workOffer>;
