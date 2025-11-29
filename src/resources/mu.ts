// src/resources/mu.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates military unit (mu) resource methods bound to the provided request context.
 */
export function mu(ctx: RequestContext) {
  return {
    getById: (id: string): Promise<EndpointMap["mu.getById"]["response"]> => {
      return ctx.request("mu.getById", { id });
    },
    getManyPaginated: (page: number, limit: number): Promise<EndpointMap["mu.getManyPaginated"]["response"]> => {
      return ctx.request("mu.getManyPaginated", { page, limit });
    },
  };
}

export type MuResource = ReturnType<typeof mu>;
