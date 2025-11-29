// src/resources/message.ts

import { GetMessagesByArticleIdResponse } from "../DTOs/message.dto";
import { RequestContext } from "../request";

export interface GetMessagesByArticleIdParams {
  articleId: string;
  direction?: "forward" | "backward";
}

/**
 * Creates message resource methods bound to the provided request context.
 * @important This resource currently only supports fetching messages by article ID and not messages in general.
 */
export function message(ctx: RequestContext) {
  return {
    getMessagesByArticleId: (
      params: GetMessagesByArticleIdParams
    ): Promise<GetMessagesByArticleIdResponse> => {
      return ctx.request("message.getMessagesByArticleId", params);
    },
  };
}

export type MessageResource = ReturnType<typeof message>;
