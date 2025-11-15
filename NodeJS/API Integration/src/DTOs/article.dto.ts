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

/**
 * Article language type - Valid article language codes (ISO 639-1)
 */
export type ArticleLanguage =
  | 'en' // English
  | 'fr' // French
  | 'de' // German
  | 'es' // Spanish
  | 'it' // Italian
  | 'ru' // Russian
  | 'ja' // Japanese
  | 'zh' // Chinese
  | 'ko' // Korean
  | 'pt' // Portuguese
  | 'ar' // Arabic
  | 'tr' // Turkish
  | 'pl' // Polish
  | 'nl' // Dutch
  | 'sv' // Swedish
  | 'fi' // Finnish
  | 'no' // Norwegian
  | 'el' // Greek
  | 'cs' // Czech
  | 'ro' // Romanian
  | 'uk' // Ukrainian
  | 'bg' // Bulgarian
  | 'vi' // Vietnamese
  | 'th' // Thai
  | 'id' // Indonesian
  | 'fa' // Persian
  | 'he' // Hebrew
  | 'ms' // Malay
  | 'ca' // Catalan
  | 'et' // Estonian
  | 'lt' // Lithuanian
  | 'lv' // Latvian
  | 'sk' // Slovak
  | 'sl' // Slovenian
  | 'hr' // Croatian
  | 'sr' // Serbian
  | 'bs' // Bosnian
  | 'mk' // Macedonian
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'ur' // Urdu
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'pa' // Punjabi
  | 'da' // Danish
  | 'hu' // Hungarian
  | 'sq' // Albanian
  | 'mt' // Maltese
  | 'is' // Icelandic
  | 'ka' // Georgian
  | 'hy' // Armenian
  | 'az' // Azerbaijani
  | 'kk' // Kazakh
  | 'uz' // Uzbek
  | 'mn' // Mongolian
  | 'ne' // Nepali
  | 'si' // Sinhala
  | 'my' // Burmese
  | 'km' // Khmer
  | 'lo' // Lao
  | 'sw' // Swahili
  | 'am' // Amharic
  | 'ha' // Hausa
  | 'yo' // Yoruba
  | 'ig' // Igbo
  | 'zu' // Zulu
  | 'af' // Afrikaans
  | 'fil' // Filipino
  | 'eu' // Basque
  | 'gl' // Galician
  | 'cy' // Welsh
  | 'ga' // Irish
  | 'gd' // Scottish Gaelic
  | 'be'; // Belarusian

/**
 * Article category type - Valid article categories
 */
export type ArticleCategory =
  | 'news'
  | 'guide'
  | 'stats'
  | 'economy'
  | 'politics'
  | 'military'
  | 'begging'
  | 'entertainment'
  | 'election'
  | 'other'
  | 'official';

/**
 * Article DTO - Represents an article entity
 */
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
