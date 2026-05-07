// src/DTOs/battle.dto.ts

/**
 * Weapon information used in a hit
 */
export interface WeaponDTO {
  _id: string;
  code: string;
  skills: {
    attack: number;
    criticalChance: number;
  };
  state: number;
  maxState: number;
  quantity: number;
  lastAcquisitionAt: string;
}

/**
 * Hit information in a battle
 */
export interface HitDTO {
  _id: string;
  user: string;
  damages: number;
  mu: string;
  isCriticalHit: boolean;
  isMissed: boolean;
  hitAt: string;
  weapon: WeaponDTO;
  ammo: null | Record<string, unknown>;
}

/**
 * Side information (attacker or defender) in a round
 */
export interface RoundSideDTO {
  country: string;
  damages: number;
  points: number;
  lastHits: HitDTO[];
  hitCount: number;
}

/**
 * Live battle information
 */
export interface LiveBattleDTO {
  ticksCount: number;
  actualTickPoints: number;
  nextTickAt: string;
}

/**
 * Current round information
 */
export interface CurrentRoundDTO {
  attacker: RoundSideDTO;
  defender: RoundSideDTO;
  live: LiveBattleDTO;
  _id: string;
  battle: string;
  number: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Battle side information
 */
export interface BattleSideDTO {
  region: string;
  country: string;
  wonRoundsCount: number;
  countryOrders: string[];
  muOrders: string[];
  damages: number;
  hitCount: number;
  bountyEffectiveAt?: string;
  moneyPer1kDamages?: number;
  moneyPool?: number;
}

/**
 * Battle stats
 */
export interface BattleStatsDTO {
  hitCount: number;
}

/**
 * Battle data
 */
export interface BattleDTO {
  defender: BattleSideDTO;
  attacker: BattleSideDTO;
  stats: BattleStatsDTO;
  _id: string;
  war: string;
  rounds: string[];
  roundsHistory: string[];
  isActive: boolean;
  isResistance: boolean;
  roundsToWin: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentRound?: CurrentRoundDTO;
}

/**
 * Response for battle.getBattles endpoint
 */
export interface GetBattlesResponse {
  result: {
    data: {
      items: BattleDTO[];
      nextCursor?: string;
    };
  };
}
