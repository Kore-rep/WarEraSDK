// src/resources/article.ts

import { request } from '../request';

/**
 * Functions related to the article resource.
 */
export const article = {
  getArticleById: async (baseUrl: string, id: string) => {
    return request('article.getArticleById', { id }, baseUrl);
  },
  getArticlesPaginated: async (baseUrl: string, page: number, limit: number) => {
    return request('article.getArticlesPaginated', { page, limit }, baseUrl);
  },
};