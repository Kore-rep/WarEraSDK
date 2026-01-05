/**
 * Spending breakdown for a country's inventory account
 */
export interface InventoryAccountSpendingDTO {
  total?: number;
  construction?: number;
  upgradeMaintenance?: number;
  alliances?: number;
  enemy?: number;
  lawEnacting?: number;
  setOrders?: number;
  battleOrder?: number;
  battleMercenaryPool?: number;
  regionBuy?: number;
  tradingMarket?: number;
  transferToCountry?: number;
  [key: string]: number | undefined; // Allow for unknown spending categories
}

/**
 * Income breakdown for a country's inventory account
 */
export interface InventoryAccountIncomesDTO {
  regionsDevelopment?: number;
  marketTaxes?: number;
  incomeTaxes?: number;
  hijackedRegionsDevelopment?: number;
  hijackedIncomeTaxes?: number;
  battleMercenaryPool?: number;
  donation?: number;
  transferToCountry?: number;
  tradingMarket?: number;
  regionBuy?: number;
  [key: string]: number | undefined; // Allow for unknown income categories
}

/**
 * Weekly inventory account record for a country
 */
export interface InventoryAccountDTO {
  _id: string;
  inventory: string;
  owner: string; // Country ID
  yearWeek: string; // Format: "2025-49"
  spending?: InventoryAccountSpendingDTO;
  incomes?: InventoryAccountIncomesDTO;
  total: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Parameters for getInventoryAccounts endpoint
 */
export interface GetInventoryAccountsParams {
  countryId: string;
}

/**
 * Response for InventoryAccount.getInventoryAccounts endpoint
 */
export interface GetInventoryAccountsResponse {
  result: {
    data: InventoryAccountDTO[];
  };
}



