import {
  GetUserLiteResponse,
  GetUsersByCountryParams,
  UsersByCountryResponseDto,
} from "../DTOs/user.dto";
import { RequestContext } from "../request";

/**
 * Creates user resource methods bound to the provided request context.
 */
export function user(ctx: RequestContext) {
  return {
    getUserLite: (id: string): Promise<GetUserLiteResponse> => {
      return ctx.request("user.getUserLite", { userId: id });
    },
    getUsersByCountry: (
      params: GetUsersByCountryParams
    ): Promise<UsersByCountryResponseDto> => {
      return ctx.request("user.getUsersByCountry", params);
    },
  };
}

export type UserResource = ReturnType<typeof user>;
