import { RegionBiome, RegionClimate, CountryCode, RegionUpgradesDTO, RegionDepositDTO, StrategicResourceListDTO } from "./constants.dto";

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
export interface GetRegionbyIdResponse {
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
