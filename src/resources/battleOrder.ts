// src/resources/battleOrder.ts

import { BattleOrderSide, GetBattleOrdersByBattleResponse } from "../DTOs/battleOrder.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

/**
 * Creates battle order resource methods bound to the provided request context.
 */
export function battleOrder(ctx: RequestContext) {
  return {
    /** Active orders for one side of a battle. */
    getByBattle: (
      battleId: string,
      side: BattleOrderSide,
      options?: RequestOptions
    ): Promise<GetBattleOrdersByBattleResponse> => {
      return ctx.request("battleOrder.getByBattle", { battleId, side }, options?.cache);
    },
  };
}

export type BattleOrderResource = ReturnType<typeof battleOrder>;
