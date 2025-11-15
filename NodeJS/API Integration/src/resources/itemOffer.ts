// src/resources/itemOffer.ts

import { request } from '../request';

/**
 * Functions related to the item offer resource.
 */
export const itemOffer = {
  getById: async (baseUrl: string, id: string) => {
    return request('itemOffer.getById', { id }, baseUrl);
  },
};