/**
 * Upgrade entity returned for `upgradeType: "bunker"` from
 * `upgrade.getUpgradeByTypeAndEntity`.
 */
export interface BunkerUpgradeDTO {
  id: string;
  region: string;
  upgradeType: "bunker" | "base" | "pacificationCenter";
  level: number;
  status: string;
  investedMoney: number;
  investedConcrete: number;
  investedSteel: number;
  dependantUsersCount: number;
  createdAt: string;
  updatedAt: string;
  _v: number;
  statusChangedAt: string;
  willBeActiveAt: string;
  lastUpgradeAt: string;
}

/**
 * Response for `upgrade.getUpgradeByTypeAndEntity` when the upgrade is a bunker
 * (`type: "bunker"`).
 */
export interface GetUpgradeByTypeAndEntityResponse {
  result: {
    data: BunkerUpgradeDTO;
  };
}
