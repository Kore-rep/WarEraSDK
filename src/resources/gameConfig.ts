// src/resources/gameConfig.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates game configuration resource methods bound to the provided request context.
 */
export function gameConfig(ctx: RequestContext) {
  return {
    getDates: (): Promise<EndpointMap["gameConfig.getDates"]["response"]> => {
      return ctx.request("gameConfig.getDates", {});
    },
    getGameConfig: (): Promise<EndpointMap["gameConfig.getGameConfig"]["response"]> => {
      return ctx.request("gameConfig.getGameConfig", {});
    },
  };
}

export type GameConfigResource = ReturnType<typeof gameConfig>;
