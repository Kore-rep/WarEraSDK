// src/resources/region.ts
import { GetRegionbyIdResponse, RegionGetRegionsObjectResponse } from '../DTOs/regions.dto';
import { request } from '../request';

export interface getRegionByIdParams {
  regionid: string;
}
/**
 * Functions related to the region resource.
 */
export const region = {
  getById: async (baseUrl: string, regionid: string):Promise<GetRegionbyIdResponse>=> {
    return request('region.getById', { regionid }, baseUrl);
  },

  /**
* Warning: This function is very expensive, please use very sparingly.
*/
  getRegionsObject: async (baseUrl: string):Promise<RegionGetRegionsObjectResponse> => {
    return request('region.getRegionsObject', {}, baseUrl);
  },
};