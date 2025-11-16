// src/resources/country.ts
import { GetAllCountriesresponse, GetCountrybyIDresponse } from '../DTOs/country.dto';
import { request } from '../request';

/**
 * Functions related to the country resource.
 */
export const country = {
  getCountryById: async (baseUrl: string, id: string):Promise<GetCountrybyIDresponse> => {
    return request('country.getCountryById', { countryId: id }, baseUrl);
  },

/**
* Warning: This function is expensive, please use sparingly.
*/
  getAllCountries: async (baseUrl: string):Promise<GetAllCountriesresponse> => {
    return request('country.getAllCountries', {}, baseUrl);
  },
};