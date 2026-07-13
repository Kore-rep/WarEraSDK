// src/resources/article.ts

import {
  GetArticleByIdResponse,
  GetArticlesPaginatedResponse,
} from "../DTOs/article.dto";
import { ArticleLanguage, ArticleCategory } from "../DTOs/constants.dto";
import { RequestContext } from "../request";
import { RequestOptions } from "../requestOptions";

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
      params: getArticleByIdParams, options?: RequestOptions): Promise<GetArticleByIdResponse> => {
      return ctx.request("article.getArticleById", params, options?.cache);
    },
    getArticlesPaginated: (
      params: getArticlesPaginatedParams, options?: RequestOptions): Promise<GetArticlesPaginatedResponse> => {
      return ctx.request("article.getArticlesPaginated", params, options?.cache);
    },
  };
}

export type ArticleResource = ReturnType<typeof article>;
