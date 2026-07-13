import {
  GetUserLiteResponse,
  GetUsersByCountryParams,
  UsersByCountryResponseDto,
} from "../DTOs/user.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

/**
 * Creates user resource methods bound to the provided request context.
 */
export function user(ctx: RequestContext) {
  return {
    getUserLite: (id: string, options?: RequestOptions): Promise<GetUserLiteResponse> => {
      return ctx.request("user.getUserLite", { userId: id }, options?.cache);
    },
    getUsersByCountry: (
      params: GetUsersByCountryParams, options?: RequestOptions): Promise<UsersByCountryResponseDto> => {
      return ctx.request("user.getUsersByCountry", params, options?.cache);
    },
  };
}

export type UserResource = ReturnType<typeof user>;
