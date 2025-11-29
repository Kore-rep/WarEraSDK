// src/resources/country.ts
import {
  GetAllCountriesResponse,
  GetCountryByIDResponse,
} from "../DTOs/country.dto";
import { RequestContext } from "../request";

/**
 * Creates country resource methods bound to the provided request context.
 */
export function country(ctx: RequestContext) {
  return {
    getCountryById: (id: string): Promise<GetCountryByIDResponse> => {
      return ctx.request("country.getCountryById", { countryId: id });
    },

    /**
     * Warning: This function is expensive, please use sparingly.
     */
    getAllCountries: (): Promise<GetAllCountriesResponse> => {
      return ctx.request("country.getAllCountries", {});
    },
  };
}

export type CountryResource = ReturnType<typeof country>;
