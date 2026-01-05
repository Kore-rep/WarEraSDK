/**
 * Transaction DTO - Represents a single transaction
 */
export interface TransactionDTO {
  _id: string;
  money: number;
  transactionType: "trading" | "donation" | "tax" | "work" | "other" | string;
  createdAt: string;
  updatedAt: string;
  __v?: number;

  // Trading-specific fields
  itemCode?: string;
  quantity?: number;
  sellerId?: string;
  buyerId?: string;
  sellerCountryId?: string;
  buyerCountryId?: string;
  offerCreatedAt?: string;
}

/**
 * Parameters for getPaginatedTransactions endpoint
 */
export interface GetPaginatedTransactionsParams {
  countryId: string;
  limit?: number;
  cursor?: string;
  direction?: "forward" | "backward";
}

/**
 * Response for transaction.getPaginatedTransactions endpoint
 */
export interface GetPaginatedTransactionsResponse {
  result: {
    data: {
      items: TransactionDTO[];
      nextCursor?: string;
    };
  };
}

