// src/resources/transaction.ts

import { RequestContext } from "../request";
import { EndpointMap } from "../types";

/**
 * Creates transaction resource methods bound to the provided request context.
 */
export function transaction(ctx: RequestContext) {
  return {
    getPaginatedTransactions: (
      page: number,
      limit: number
    ): Promise<EndpointMap["transaction.getPaginatedTransactions"]["response"]> => {
      return ctx.request("transaction.getPaginatedTransactions", {
        page,
        limit,
      });
    },
  };
}

export type TransactionResource = ReturnType<typeof transaction>;
