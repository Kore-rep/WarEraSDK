import type { WeaponDTO } from "./battle.dto";

/**
 * Shared fields for battle ranking queries.
 * Pass either `roundId` or `battleId` (not both required by API).
 */
type GetBattleRankingParamsBase = {
  dataType: "damage" | "points" | "money";
  type: "user" | "country" | "mu";
  side: "attacker" | "defender" | "merged";
};

export type GetBattleRankingParams =
  | (GetBattleRankingParamsBase & { roundId: string; battleId?: undefined })
  | (GetBattleRankingParamsBase & { battleId: string; roundId?: undefined });

/**
 * A single row in a battle ranking list.
 * The entity id field depends on `type` (e.g. `user` for user rankings).
 */
export interface BattleRankingEntryDTO {
  _id: string;
  value: number;
  rank: number;
  lootItem?: WeaponDTO | null;
  user?: string;
  country?: string;
  mu?: string;
}

/**
 * Response for battleRanking.getRanking
 */
export interface GetBattleRankingResponse {
  result: {
    data: {
      rankings: BattleRankingEntryDTO[];
    };
  };
}
