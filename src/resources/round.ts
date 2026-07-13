// src/resources/round.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates round resource methods bound to the provided request context.
 */
export function round(ctx: RequestContext) {
  return {
    getById: (id: string, options?: RequestOptions): Promise<EndpointMap["round.getById"]["response"]> => {
      return ctx.request("round.getById", { id }, options?.cache);
    },
    getLastHits: (options?: RequestOptions): Promise<EndpointMap["round.getLastHits"]["response"]> => {
      return ctx.request("round.getLastHits", {}, options?.cache);
    },
  };
}

export type RoundResource = ReturnType<typeof round>;
