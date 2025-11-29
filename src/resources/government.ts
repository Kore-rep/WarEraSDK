// src/resources/government.ts

import { request } from '../request';

/**
 * Functions related to the government resource.
 */
export const government = {
  getByCountryId: async (baseUrl: string, countryId: string) => {
    return request('government.getByCountryId', { countryId }, baseUrl);
  },
};