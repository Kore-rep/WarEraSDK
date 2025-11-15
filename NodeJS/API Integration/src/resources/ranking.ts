// src/resources/ranking.ts

import { request } from '../request';

/**
 * Functions related to the ranking resource.
 */
export const ranking = {
  getRanking: async (baseUrl: string) => {
    return request('ranking.getRanking', {}, baseUrl);
  },
};