// src/resources/transaction.ts

import { RequestContext } from "../request";
import {
  GetPaginatedTransactionsParams,
  GetPaginatedTransactionsResponse,
} from "../DTOs/transaction.dto";

/**
 * Creates transaction resource methods bound to the provided request context.
 */
export function transaction(ctx: RequestContext) {
  return {
    /**
     * Get paginated transactions for a country
     * @param params - Query parameters including countryId, limit, cursor, direction
     * @returns Paginated transaction results with cursor for next page
     */
    getPaginatedTransactions: (
      params: GetPaginatedTransactionsParams
    ): Promise<GetPaginatedTransactionsResponse> => {
      return ctx.request("transaction.getPaginatedTransactions", params);
    },
  };
}

export type TransactionResource = ReturnType<typeof transaction>;
