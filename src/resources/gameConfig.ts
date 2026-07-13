// src/resources/gameConfig.ts

import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";
import { EndpointMap } from "../types";

/**
 * Creates game configuration resource methods bound to the provided request context.
 */
export function gameConfig(ctx: RequestContext) {
  return {
    getDates: (options?: RequestOptions): Promise<EndpointMap["gameConfig.getDates"]["response"]> => {
      return ctx.request("gameConfig.getDates", {}, options?.cache);
    },
    getGameConfig: (options?: RequestOptions): Promise<EndpointMap["gameConfig.getGameConfig"]["response"]> => {
      return ctx.request("gameConfig.getGameConfig", {}, options?.cache);
    },
  };
}

export type GameConfigResource = ReturnType<typeof gameConfig>;
