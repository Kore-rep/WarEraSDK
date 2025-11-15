// src/resources/article.ts

import { ArticleCategory, ArticleLanguage, GetArticleByIdResponse, GetArticlesPaginatedResponse } from '../DTOs/article.dto';
import { request } from '../request';

export interface getArticleByIdParams {
  articleId: string;
}

export interface getArticlesPaginatedParams {
  /**
   * The option "my" requires an authorization token to be set.
   */
  type: 'last' | 'popular' | 'top' | 'subscribed' | 'my';
  limit: number;
  cursor?: string;
  userId: string;
  direction?: 'forward' | 'backward';
  languages?: ArticleLanguage[];
  categories?: ArticleCategory[];
}

/**
 * Functions related to the article resource.
 */
export const article = {
  getArticleById: async (baseUrl: string, params: getArticleByIdParams): Promise<GetArticleByIdResponse> => {
    return request('article.getArticleById', params, baseUrl);
  },
  getArticlesPaginated: async (baseUrl: string, params: getArticlesPaginatedParams): Promise<GetArticlesPaginatedResponse> => {
    return request('article.getArticlesPaginated', params, baseUrl);
  },
};