// src/DTOs/mercenaryContractAuction.dto.ts

/**
 * Individual bid on a mercenary contract auction
 */
export interface BidDTO {
  mu: string;
  user: string;
  perK: number;
  payout: number;
  bidAt: string;
}

/**
 * Mercenary contract auction data
 */
export interface MercenaryContractAuctionDTO {
  _id: string;
  country: string;
  createdBy: string;
  battle: string;
  forCountry: string;
  forCountrySide: "attacker" | "defender";
  minimumDamage: number;
  budget: number;
  initialPerK: number;
  duration: number;
  professionalsOnly: boolean;
  expiresAt: string;
  currentPerK: number;
  currentPayout: number;
  bids: BidDTO[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentWinner?: string;
  currentWinnerUser?: string;
}

/**
 * Parameters for mercenaryContractAuction.getPaginatedAuctions endpoint
 */
export interface GetPaginatedAuctionsParams {
  battleId?: string;
  countryId?: string;
  status?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Data structure for paginated auctions response
 */
export interface GetPaginatedAuctionsDataDTO {
  items: MercenaryContractAuctionDTO[];
  nextCursor?: string;
}

/**
 * Response for mercenaryContractAuction.getPaginatedAuctions endpoint
 */
export interface GetPaginatedAuctionsResponse {
  result: {
    data: GetPaginatedAuctionsDataDTO;
  };
}