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
  muWeeklyDamages: RankingEntryDTO;
  muBounty: RankingEntryDTO;
  muDamages: RankingEntryDTO;
  muTerrain: RankingEntryDTO;
  muWealth: RankingEntryDTO;
}

export interface MuActiveUpgradeLevelsDTO {
  headquarters?: number;
  dormitories?: number;
}

export interface MuDTO {
  roles: MuRolesDTO;
  leveling: MuLevelingDTO;
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
  avatarUrl: string;
  rankings: MuRankingsDTO;
  investedMoneyByUsers: Record<string, number>;
  country: string;
}

export interface GetMuByIdParams {
  muId: string;
}

export interface GetMuByIdResponse {
  result: {
    data: MuDTO;
  };
}
