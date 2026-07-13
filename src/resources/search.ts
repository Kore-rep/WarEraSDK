// src/resources/search.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates search resource methods bound to the provided request context.
 */
export function search(ctx: RequestContext) {
  return {
    /**
     * Search users/MUs/countries by text. The live API expects `searchText`
     * (a `query` param is rejected with BAD_REQUEST).
     */
    searchAnything: (searchText: string, options?: RequestOptions): Promise<EndpointMap["search.searchAnything"]["response"]> => {
      return ctx.request("search.searchAnything", { searchText }, options?.cache);
    },
  };
}

export type SearchResource = ReturnType<typeof search>;
