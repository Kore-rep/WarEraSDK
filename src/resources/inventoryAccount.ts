// src/resources/inventoryAccount.ts

import { RequestContext } from "../request";
import {
  GetInventoryAccountsParams,
  GetInventoryAccountsResponse,
} from "../DTOs/inventoryAccount.dto";

/**
 * Creates inventory account resource methods bound to the provided request context.
 */
export function inventoryAccount(ctx: RequestContext) {
  return {
    /**
     * Get inventory accounts (weekly financial records) for a country
     * @param params - Query parameters including countryId
     * @returns Array of weekly inventory account records
     */
    getInventoryAccounts: (
      params: GetInventoryAccountsParams
    ): Promise<GetInventoryAccountsResponse> => {
      return ctx.request("inventoryAccount.getInventoryAccounts", params);
    },
  };
}

export type InventoryAccountResource = ReturnType<typeof inventoryAccount>;



