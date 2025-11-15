// src/resources/transaction.ts

import { request } from '../request';

/**
 * Functions related to the transaction resource.
 */
export const transaction = {
  getPaginatedTransactions: async (baseUrl: string, page: number, limit: number) => {
    return request('transaction.getPaginatedTransactions', { page, limit }, baseUrl);
  },
};