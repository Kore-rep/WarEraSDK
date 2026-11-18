/**
 * Battle side an order applies to.
 */
export type BattleOrderSide = "attacker" | "defender";

/**
 * How urgently the ordering country / MU wants the side fought for.
 */
export type BattleOrderPriority = "low" | "medium" | "high";

/**
 * Parameters for battleOrder.getByBattle
 */
export interface GetBattleOrdersByBattleParams {
  battleId: string;
  side: BattleOrderSide;
}

/**
 * Battle order DTO - an active order a country or MU placed on one side of a battle.
 * `text` and `rank` are only filled in for citizens of the ordering country / members
 * of the ordering MU; everyone else gets an empty text and a rank of 0.
 */
export interface BattleOrderDTO {
  _id: string;
  battle: string;
  side: BattleOrderSide;
  /** Country of the side being ordered on. */
  sideCountry: string;
  /** Ordering country (country orders). */
  country?: string;
  /** Ordering MU (MU orders). */
  mu?: string;
  /** User who placed the order. */
  user: string;
  priority: BattleOrderPriority;
  rank: number;
  text: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

/**
 * Response for battleOrder.getByBattle endpoint
 */
export interface GetBattleOrdersByBattleResponse {
  result: {
    data: BattleOrderDTO[];
  };
}
