import { RankingEntryDTO, StrategicResourcesDTO,CountryCode,CountryName  } from './constants.dto';

/** 
 * Country Taxesinterface - Represents taxes earned by a country
 */
export interface CountryTaxesDTO {
  income: number;
  market: number;
  selfWork: number;
}
/**
 * Country DTO - Represents a country
 */
export interface CountryDto {
    _id: string;
    name: CountryName;               // e.g., "United States", "France" etc.
    code: CountryCode;          // e.g., "US", "FR" etc.
    money: number;
    taxes: CountryTaxesDTO;
    orgs: string[];             // org IDs
    allies: string[];           // country IDs
    warsWith: string[];         // country IDs
    scheme: string;             // e.g., "yellow", "blue", etc.
    mapAccent: string;          // e.g., "normal", "dark", etc.
    rankings: {
        countryRegionDiff: RankingEntryDTO;
        countryDamages: RankingEntryDTO;
        weeklyCountryDamages: RankingEntryDTO;
        weeklyCountryDamagesPerCitizen: RankingEntryDTO;
        countryDevelopment: RankingEntryDTO;
        countryActivePopulation: RankingEntryDTO;
        countryWealth: RankingEntryDTO;
        countryProductionBonus: RankingEntryDTO;
    };
    strategicResources: StrategicResourcesDTO;
    __v: number;                // unsure purpose
    currentBattleOrder: string[]; 
    updatedAt: string;          // ISO timestamp
    enemy: string[];              // country ID 
    rulingParty: string; // Party ID
}
/**
 * Response for country.getAllCountries endpoint
 */
export interface GetAllCountriesResponse {
    result: {
        data: CountryDto[];     // array of countries
    }
}
/**
 * Response for country.getCountryById endpoint
 */
export interface GetCountryByIDResponse {
    result: {
        data: CountryDto;       // single country
    }
}