// src/resources/upgrade.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates upgrade resource methods bound to the provided request context.
 */
export function upgrade(ctx: RequestContext) {
  return {
    getUpgradeByTypeAndEntity: (
      type: string,
      entityId: string
    ): Promise<EndpointMap["upgrade.getUpgradeByTypeAndEntity"]["response"]> => {
      return ctx.request("upgrade.getUpgradeByTypeAndEntity", {
        type,
        entityId,
      });
    },
  };
}

export type UpgradeResource = ReturnType<typeof upgrade>;
