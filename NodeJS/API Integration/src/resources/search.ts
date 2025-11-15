// src/resources/search.ts

import { request } from '../request';

/**
 * Functions related to the search resource.
 */
export const search = {
  searchAnything: async (baseUrl: string, query: string) => {
    return request('search.searchAnything', { query }, baseUrl);
  },
};