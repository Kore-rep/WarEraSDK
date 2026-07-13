// src/resources/government.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates government resource methods bound to the provided request context.
 */
export function government(ctx: RequestContext) {
  return {
    getByCountryId: (countryId: string, options?: RequestOptions): Promise<EndpointMap["government.getByCountryId"]["response"]> => {
      return ctx.request("government.getByCountryId", { countryId }, options?.cache);
    },
  };
}

export type GovernmentResource = ReturnType<typeof government>;
