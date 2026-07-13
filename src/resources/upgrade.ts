// src/resources/upgrade.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates upgrade resource methods bound to the provided request context.
 */
export function upgrade(ctx: RequestContext) {
  return {
    getUpgradeByTypeAndEntity: (
      type: string,
      entityId: string, options?: RequestOptions): Promise<EndpointMap["upgrade.getUpgradeByTypeAndEntity"]["response"]> => {
      return ctx.request("upgrade.getUpgradeByTypeAndEntity", {
        upgradeType: type,
        regionId: entityId,
      }, options?.cache);
    },
  };
}

export type UpgradeResource = ReturnType<typeof upgrade>;
