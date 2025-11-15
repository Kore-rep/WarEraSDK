// src/resources/country.ts

import { request } from '../request';

/**
 * Functions related to the country resource.
 */
export const country = {
  getCountryById: async (baseUrl: string, id: string) => {
    return request('country.getCountryById', { countryId: id }, baseUrl);
  },
  getAllCountries: async (baseUrl: string) => {
    return request('country.getAllCountries', {}, baseUrl);
  },
};