// src/resources/country.ts
import { GetAllCountriesResponse, GetCountrybyIDResponse } from '../DTOs/country.dto';
import { request } from '../request';

/**
 * Functions related to the country resource.
 */
export const country = {
  getCountryById: async (baseUrl: string, id: string):Promise<GetCountrybyIDResponse> => {
    return request('country.getCountryById', { countryId: id }, baseUrl);
  },

/**
* Warning: This function is expensive, please use sparingly.
*/
  getAllCountries: async (baseUrl: string):Promise<GetAllCountriesResponse> => {
    return request('country.getAllCountries', {}, baseUrl);
  },
};