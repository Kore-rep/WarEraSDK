// src/resources/region.ts

import { request } from '../request';

/**
 * Functions related to the region resource.
 */
export const region = {
  getById: async (baseUrl: string, id: string) => {
    return request('region.getById', { id }, baseUrl);
  },
  getRegionsObject: async (baseUrl: string) => {
    return request('region.getRegionsObject', {}, baseUrl);
  },
};