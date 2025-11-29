// src/resources/upgrade.ts

import { request } from '../request';

/**
 * Functions related to the upgrade resource.
 */
export const upgrade = {
  getUpgradeByTypeAndEntity: async (baseUrl: string, type: string, entityId: string) => {
    return request('upgrade.getUpgradeByTypeAndEntity', { type, entityId }, baseUrl);
  },
};