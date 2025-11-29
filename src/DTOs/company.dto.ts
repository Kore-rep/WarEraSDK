/**
 * Company DTO - Represents a company entity
 */
export interface CompanyDTO {
  _id: string;
  user: string;
  region: string;
  itemCode: string;
  isFull: boolean;
  name: string;
  concreteInvested: number;
  production: number;
  activeUpgradeLevels: {
    storage: number;
    automatedEngine: number;
    breakRoom: number;
  };
  workers: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  estimatedValue: number;
  workOffer?: string;
  dates?: {
    lastHiresAt: string[];
  };
}

/**
 * Response for company.getById endpoint
 */
export interface GetCompanyByIdResponse {
  result: {
    data: CompanyDTO;
  };
}

/**
 * Response for company.getCompanies endpoint (TBA - To Be Added)
 */
export interface GetCompaniesResponse {
  result: {
    data: {
      items: string[]; // Returns company IDs
    };
  };
}
