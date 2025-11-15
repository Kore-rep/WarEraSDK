// src/resources/battleRanking.ts

import { request } from '../request';

/**
 * Functions related to the battle ranking resource.
 */
export const battleRanking = {
  getRanking: async (baseUrl: string) => {
    return request('battleRanking.getRanking', {}, baseUrl);
  },
};