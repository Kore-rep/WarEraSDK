// src/resources/search.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates search resource methods bound to the provided request context.
 */
export function search(ctx: RequestContext) {
  return {
    searchAnything: (query: string): Promise<EndpointMap["search.searchAnything"]["response"]> => {
      return ctx.request("search.searchAnything", { query });
    },
  };
}

export type SearchResource = ReturnType<typeof search>;
