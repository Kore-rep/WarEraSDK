// src/resources/battle.ts

import { request } from '../request';

/**
 * Functions related to the battle resource.
 */
export const battle = {
  getById: async (baseUrl: string, id: string) => {
    return request('battle.getById', { id }, baseUrl);
  },
  getLiveBattleData: async (baseUrl: string) => {
    return request('battle.getLiveBattleData', {}, baseUrl);
  },
  getBattles: async (baseUrl: string) => {
    return request('battle.getBattles', {}, baseUrl);
  },
};