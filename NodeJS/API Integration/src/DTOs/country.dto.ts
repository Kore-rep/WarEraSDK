import { RankingEntryDTO } from './user.dto';

/** 
 * Country Taxesinterface - Represents taxes earned by a country
 */
export interface CountryTaxesDto {
  income: number;
  market: number;
  selfWork: number;
}
/**
 * Country DTO - Represents a country
 */
export interface CountryDto {
    _id: string;
    name: string;               // e.g., "United States", "France" etc.
    code: string;               // e.g., "US", "FR" etc.
    money: number;
    taxes: CountryTaxesDto;
    orgs: string[];             // org IDs
    allies: string[];           // country IDs
    warsWith: string[];         // country IDs
    scheme: string;             // e.g., "yellow", "blue", etc.
    mapAccent: string;          // e.g., "normal", "dark", etc.
    rankings: {
        countryRegionDiff: RankingEntryDTO;
        countryDamages: RankingEntryDTO;
        weeklyCountryDamages: RankingEntryDTO;
        countryDevelopment: RankingEntryDTO;
        countryActivePopulation: RankingEntryDTO;
        countryWealth: RankingEntryDTO;
        countryProductionBonus: RankingEntryDTO;
    };
    __v: number;                // unsure purpose
    updatedAt: string;          // ISO timestamp
    enemy: string;              // country ID 
}
/**
 * Response for country.getAllCountries endpoint
 */
export interface GetAllCountriesresponse {
    result: {
        data: CountryDto[];     // array of countries
    }
}
/**
 * Response for country.getCountryById endpoint
 */
export interface GetCountrybyIDresponse {
    result: {
        data: CountryDto;       // single country
    }
}