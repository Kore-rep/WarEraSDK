import {
  GetPaginatedLawsParams,
  GetPaginatedLawsResponse,
} from "../DTOs/laws.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

/**
 * Creates laws resource methods bound to the provided request context.
 */
export function laws(ctx: RequestContext) {
  return {
    /**
     * Get paginated laws for a country
     * @param params - Country id and optional cursor pagination options
     * @returns Paginated law items with optional next cursor
     */
    getPaginatedLaws: (
      params: GetPaginatedLawsParams, options?: RequestOptions): Promise<GetPaginatedLawsResponse> => {
      return ctx.request("law.getPaginatedLaws", params, options?.cache);
    },
  };
}

export type LawsResource = ReturnType<typeof laws>;
