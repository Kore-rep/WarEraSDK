// src/resources/article.ts

import {
  GetArticleByIdResponse,
  GetArticlesPaginatedResponse,
} from "../DTOs/article.dto";
import { ArticleLanguage, ArticleCategory } from "../DTOs/constants.dto";
import { RequestContext } from "../request";

export interface getArticleByIdParams {
  articleId: string;
}

export interface getArticlesPaginatedParams {
  /**
   * The option "my" requires an authorization token to be set.
   */
  type: "last" | "popular" | "top" | "subscribed" | "my";
  limit: number;
  cursor?: string;
  userId: string;
  direction?: "forward" | "backward";
  languages?: ArticleLanguage[];
  categories?: ArticleCategory[];
}

/**
 * Creates article resource methods bound to the provided request context.
 */
export function article(ctx: RequestContext) {
  return {
    getArticleById: (
      params: getArticleByIdParams
    ): Promise<GetArticleByIdResponse> => {
      return ctx.request("article.getArticleById", params);
    },
    getArticlesPaginated: (
      params: getArticlesPaginatedParams
    ): Promise<GetArticlesPaginatedResponse> => {
      return ctx.request("article.getArticlesPaginated", params);
    },
  };
}

export type ArticleResource = ReturnType<typeof article>;
