import { CountryCode, StrategicResourceListDTO } from "./constants.dto";
/**
 * Region Biome type
 */
export type RegionBiome =
  | "plains"
  | "desert"
  | "tundra"
  | "forest"
  | "rainforest"
  | "mountain"
  | string; // fallback for unknown biome types
/**
 * Region Climate type
 */

export type RegionClimate =
  | "moderate"
  | "arid"
  | "cold"
  | "tropical"
  | string; // fallback for unknown climate types
/**
 * Region Upgrade Entry DTO - Represents a single upgrade entry in a region
 */
export interface RegionUpgradeEntryDTO {
  level: number;
  constructionPoints: number;
  investedMoney: number;
  constructionStartedAt: string | null;
  isUnderConstruction: boolean | null;
  lastConstructions: any[];
  status: string;
  constructionEndedAt: string | null;
}

export interface RegionUpgradesDTO {
  upgrades: Record<string, RegionUpgradeEntryDTO>; // dynamic upgrade list
  activeConstructionCount?: number;
}
/**
 * Region Deposit DTO - Represents a resource deposit in a region
 */
export interface RegionDepositDTO {
  type: string;       // petroleum, uranium, gold, etc.
  quantity: number;
  consumed: number;
}

export type RegionActiveUpgradeLevelsDTO = Record<string, number>;

export interface RegionDTO {
  _id: string;
  code: string;
  country: string;
  initialCountry: string;
  stats: {
    investedMoney: number;
  };
  dates: {
    lastOwnershipChangeAt: string;
  };
  neighbors: string[];
  isCapital: boolean;
  isLinkedToCapital: boolean;
  upgradesV2: RegionUpgradesDTO;
  name: string;
  mainCity: string;
  development: number;
  baseDevelopment: number;
  countryCode: CountryCode;
  position: [number, number]; 
  biome: RegionBiome;
  climate: RegionClimate;
  __v: number;
  activeUpgradeLevels?: RegionActiveUpgradeLevelsDTO;
  resistance: number;
  strategicResource?: StrategicResourceListDTO;
  deposit?: RegionDepositDTO;
}
/**
 *  Response for region.getbyId endpoint
 */
export interface GetRegionByIdResponse {
  result: {
    data: RegionDTO[];
  };
}
/**
 * Response for region.getRegionsObject
 */
export interface RegionGetRegionsObjectResponse {
  result: {
    data: Record<string, RegionDTO>;
  };
}
