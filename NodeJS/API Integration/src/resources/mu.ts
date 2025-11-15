// src/resources/mu.ts

import { request } from '../request';

/**
 * Functions related to the military unit (mu) resource.
 */
export const mu = {
  getById: async (baseUrl: string, id: string) => {
    return request('mu.getById', { id }, baseUrl);
  },
  getManyPaginated: async (baseUrl: string, page: number, limit: number) => {
    return request('mu.getManyPaginated', { page, limit }, baseUrl);
  },
};