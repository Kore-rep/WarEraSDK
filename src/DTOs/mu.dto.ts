import { RankingEntryDTO } from "./constants.dto";

export interface MuRolesDTO {
  managers: string[];
  commanders: string[];
}

export interface MuLevelingDTO {
  level: number;
  monthlyDamages: number;
}

export interface MuRankingsDTO {
  muWealth: RankingEntryDTO;
  muWeeklyDamages?: RankingEntryDTO;
  muBounty?: RankingEntryDTO;
  muReputation?: RankingEntryDTO;
  muDamages?: RankingEntryDTO;
  muTerrain?: RankingEntryDTO;
  muMercenaryEarnings?: RankingEntryDTO;
}

export interface MuActiveUpgradeLevelsDTO {
  headquarters?: number;
  dormitories?: number;
}

export interface MuDTO {
  roles: MuRolesDTO;
  leveling?: MuLevelingDTO;
  mercenaryReputation: number;
  _id: string;
  user: string;
  region: string;
  name: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  activeUpgradeLevels: MuActiveUpgradeLevelsDTO;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  rankings: MuRankingsDTO;
  investedMoneyByUsers?: Record<string, number>;
  country: string;
  /** MU type, e.g. "privateMercenary". */
  type?: string;
  lastCountryChangeAt?: string; // ISO timestamp
  lastAnnouncementAt?: string; // ISO timestamp
  lastReputationBuyAt?: string; // ISO timestamp
}

export interface GetMuByIdParams {
  muId: string;
}

export interface GetMuByIdResponse {
  result: {
    data: MuDTO;
  };
}
