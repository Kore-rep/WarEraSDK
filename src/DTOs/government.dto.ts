// src/DTOs/government.dto.ts

/**
 * Government DTO representing a country's government structure.
 * Role fields are optional as positions may be vacant.
 */
export interface GovernmentDTO {
  _id: string;
  country: string;
  congressMembers: string[];
  __v: number;
  president?: string;
  vicePresident?: string;
  minOfDefense?: string;
  minOfForeignAffairs?: string;
  minOfEconomy?: string;
}

/**
 * Response type for government.getByCountryId endpoint
 */
export interface GetGovernmentByCountryIdResponse {
  result: {
    data: GovernmentDTO;
  };
}


