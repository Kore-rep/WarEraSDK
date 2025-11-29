// src/resources/round.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates round resource methods bound to the provided request context.
 */
export function round(ctx: RequestContext) {
  return {
    getById: (id: string): Promise<EndpointMap["round.getById"]["response"]> => {
      return ctx.request("round.getById", { id });
    },
    getLastHits: (): Promise<EndpointMap["round.getLastHits"]["response"]> => {
      return ctx.request("round.getLastHits", {});
    },
  };
}

export type RoundResource = ReturnType<typeof round>;
