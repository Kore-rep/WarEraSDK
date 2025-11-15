import { GetCompaniesResponse, GetCompanyByIdResponse } from '../DTOs/company.dto';
import { request } from '../request';


export interface getCompanyByIdParams {
  id: string;
}

/**
 * Parameters for company.getCompanies endpoint
 */
export interface GetCompaniesParams {
  userId: string;
  orgId?: string;
  perPage?: number;
  cursor?: string;
  direction?: 'forward' | 'backward';
}


export const company = {

  /**
   * Get a company by ID
   * 
   * @param baseUrl - The base URL for the API
   * @param id - The company ID
   * @returns Company data
   */
  getById: async (baseUrl: string, params: getCompanyByIdParams): Promise<GetCompanyByIdResponse> => {
    return request('company.getById', params, baseUrl);
  },

  /**
   * Get companies list
   * 
   * @param baseUrl - The base URL for the API
   * @param params - Query parameters
   * @param params.userId - User ID (mandatory)
   * @param params.orgId - Organization ID (optional)
   * @param params.perPage - Number of items per page (default: 12)
   * @param params.cursor - Cursor for pagination (optional)
   * @param params.direction - Direction for pagination (default: 'forward')
   * @returns List of companies
   */
  getCompanies: async (
    baseUrl: string,
    params: GetCompaniesParams
  ): Promise<GetCompaniesResponse> => {
    return request('company.getCompanies', params, baseUrl);
  },
};