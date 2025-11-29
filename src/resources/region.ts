// src/resources/region.ts
import {
  GetRegionByIdResponse,
  RegionGetRegionsObjectResponse,
} from "../DTOs/regions.dto";
import { RequestContext } from "../request";

export interface getRegionByIdParams {
  regionid: string;
}

/**
 * Creates region resource methods bound to the provided request context.
 */
export function region(ctx: RequestContext) {
  return {
    getById: (regionid: string): Promise<GetRegionByIdResponse> => {
      return ctx.request("region.getById", { regionid });
    },

    /**
     * Warning: This function is very expensive, please use very sparingly.
     */
    getRegionsObject: (): Promise<RegionGetRegionsObjectResponse> => {
      return ctx.request("region.getRegionsObject", {});
    },
  };
}

export type RegionResource = ReturnType<typeof region>;
