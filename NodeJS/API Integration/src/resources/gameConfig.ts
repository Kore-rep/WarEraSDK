// src/resources/gameConfig.ts

import { request } from '../request';

/**
 * Functions related to the game configuration resource.
 */
export const gameConfig = {
  getDates: async (baseUrl: string) => {
    return request('gameConfig.getDates', {}, baseUrl);
  },
  getGameConfig: async (baseUrl: string) => {
    return request('gameConfig.getGameConfig', {}, baseUrl);
  },
};