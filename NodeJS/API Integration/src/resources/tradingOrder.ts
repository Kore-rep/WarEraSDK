// src/resources/tradingOrder.ts

import { request } from '../request';

/**
 * Functions related to the trading order resource.
 */
export const tradingOrder = {
  getTopOrders: async (baseUrl: string) => {
    return request('tradingOrder.getTopOrders', {}, baseUrl);
  },
};