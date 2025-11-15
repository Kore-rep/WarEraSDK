// src/resources/user.ts

import { request } from '../request';

/**
 * Functions related to the user resource.
 */
export const user = {
  getUserLite: async (baseUrl: string, id: string) => {
    return request('user.getUserLite', { id }, baseUrl);
  },
  getUsersByCountry: async (baseUrl: string, countryId: string) => {
    return request('user.getUsersByCountry', { countryId }, baseUrl);
  },
};