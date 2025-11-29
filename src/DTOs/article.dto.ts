import { ArticleCategory, ArticleLanguage } from './constants.dto';
/**
 * Article stats - Engagement metrics for an article
 */
export interface ArticleStats {
  likes: number;
  views: number;
  comments: number;
  subs: number;
  tips: number;
}

export interface ArticleDTO {
  _id: string;
  title: string;
  content: string;
  language: ArticleLanguage;
  category: ArticleCategory;
  author: string;
  isPublished: boolean;
  isDeleted: boolean;
  stats: ArticleStats;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Response for article.getArticleById endpoint
 */
export interface GetArticleByIdResponse {
  result: {
    data: ArticleDTO;
  };
}

/**
 * Response for article.getArticlesPaginated endpoint
 */
export interface GetArticlesPaginatedResponse {
  result: {
    data: {
      items: ArticleDTO[];
      nextCursor?: string;
    };
  };
}
