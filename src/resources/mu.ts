// src/resources/mu.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates military unit (mu) resource methods bound to the provided request context.
 */
export function mu(ctx: RequestContext) {
  return {
    getById: (muId: string, options?: RequestOptions): Promise<EndpointMap["mu.getById"]["response"]> => {
      return ctx.request("mu.getById", { muId }, options?.cache);
    },
    getManyPaginated: (page: number, limit: number, options?: RequestOptions): Promise<EndpointMap["mu.getManyPaginated"]["response"]> => {
      return ctx.request("mu.getManyPaginated", { page, limit }, options?.cache);
    },
  };
}

export type MuResource = ReturnType<typeof mu>;
