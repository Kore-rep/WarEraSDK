import { GetUserLiteResponse, UsersByCountryResponseDto } from "DTOs/user.dto";
import { request } from "../request";

/**
 * Functions related to the user resource.
 */
export const user = {
  getUserLite: async (
    baseUrl: string,
    id: string
  ): Promise<GetUserLiteResponse> => {
    return request("user.getUserLite", { userId: id }, baseUrl);
  },
  getUsersByCountry: async (
    baseUrl: string,
    countryId: string
  ): Promise<UsersByCountryResponseDto> => {
    return request("user.getUsersByCountry", { countryId }, baseUrl);
  },
};
