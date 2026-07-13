import {
  GetCompaniesResponse,
  GetCompanyByIdResponse,
} from "../DTOs/company.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

export interface getCompanyByIdParams {
  companyId: string;
}

/**
 * Parameters for company.getCompanies endpoint
 */
export interface GetCompaniesParams {
  /** Filter by user ID. If omitted, returns all companies. */
  userId?: string;
  /** Filter by organization ID */
  orgId?: string;
  /** Number of items per page (max: 100, default: 12) */
  perPage?: number;
  /** Cursor for pagination (use nextCursor/prevCursor from response) */
  cursor?: string;
  /** Pagination direction */
  direction?: "forward" | "backward";
}

/**
 * Creates company resource methods bound to the provided request context.
 */
export function company(ctx: RequestContext) {
  return {
    /**
     * Get a company by ID
     *
     * @param params - The company ID params
     * @returns Company data
     */
    getById: (params: getCompanyByIdParams, options?: RequestOptions): Promise<GetCompanyByIdResponse> => {
      return ctx.request("company.getById", params, options?.cache);
    },

    /**
     * Get companies list (paginated)
     *
     * @param params - Query parameters (all optional)
     * @param params.userId - Filter by user ID. If omitted, returns all companies.
     * @param params.orgId - Filter by organization ID
     * @param params.perPage - Number of items per page (max: 100, default: 12)
     * @param params.cursor - Cursor for pagination (use nextCursor from response)
     * @param params.direction - Pagination direction (default: 'forward')
     * @returns Paginated list of company IDs with cursor info
     */
    getCompanies: (params?: GetCompaniesParams, options?: RequestOptions): Promise<GetCompaniesResponse> => {
      return ctx.request("company.getCompanies", params || {}, options?.cache);
    },
  };
}

export type CompanyResource = ReturnType<typeof company>;
