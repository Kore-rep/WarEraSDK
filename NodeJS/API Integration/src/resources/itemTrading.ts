// src/resources/itemTrading.ts

import { request } from '../request';

/**
 * Functions related to the item trading resource.
 */
export const itemTrading = {
  getPrices: async (baseUrl: string) => {
    return request('itemTrading.getPrices', {}, baseUrl);
  },
};