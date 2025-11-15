// src/resources/round.ts

import { request } from '../request';

/**
 * Functions related to the round resource.
 */
export const round = {
  getById: async (baseUrl: string, id: string) => {
    return request('round.getById', { id }, baseUrl);
  },
  getLastHits: async (baseUrl: string) => {
    return request('round.getLastHits', {}, baseUrl);
  },
};