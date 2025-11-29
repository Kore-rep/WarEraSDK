// src/resources/battle.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates battle resource methods bound to the provided request context.
 */
export function battle(ctx: RequestContext) {
  return {
    getById: (id: string): Promise<EndpointMap["battle.getById"]["response"]> => {
      return ctx.request("battle.getById", { id });
    },
    getLiveBattleData: (): Promise<EndpointMap["battle.getLiveBattleData"]["response"]> => {
      return ctx.request("battle.getLiveBattleData", {});
    },
    getBattles: (): Promise<EndpointMap["battle.getBattles"]["response"]> => {
      return ctx.request("battle.getBattles", {});
    },
  };
}

export type BattleResource = ReturnType<typeof battle>;
