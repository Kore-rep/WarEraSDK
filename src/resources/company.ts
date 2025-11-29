import {
  GetCompaniesResponse,
  GetCompanyByIdResponse,
} from "../DTOs/company.dto";
import { RequestContext } from "../request";

export interface getCompanyByIdParams {
  id: string;
}

/**
 * Parameters for company.getCompanies endpoint
 */
export interface GetCompaniesParams {
  userId: string;
  /**
   * Warning: This parameter has not been tested yet.
   */
  orgId?: string;
  perPage?: number;
  /**
   * Warning: This parameter has not been tested yet.
   */
  cursor?: string;
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
    getById: (params: getCompanyByIdParams): Promise<GetCompanyByIdResponse> => {
      return ctx.request("company.getById", params);
    },

    /**
     * Get companies list
     *
     * @param params - Query parameters
     * @param params.userId - User ID (mandatory)
     * @param params.orgId - Organization ID (optional)
     * @param params.perPage - Number of items per page (default: 12)
     * @param params.cursor - Cursor for pagination (optional)
     * @param params.direction - Direction for pagination (default: 'forward')
     * @returns List of companies
     */
    getCompanies: (params: GetCompaniesParams): Promise<GetCompaniesResponse> => {
      return ctx.request("company.getCompanies", params);
    },
  };
}

export type CompanyResource = ReturnType<typeof company>;
