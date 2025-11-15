// src/resources/message.ts

import { GetMessagesByArticleIdResponse } from '../DTOs/message.dto';
import { request } from '../request';

export interface GetMessagesByArticleIdParams {
  articleId: string;
  direction?: 'forward' | 'backward';
}

/**
 * Functions related to the message resource.
 * @important This resource currently only supports fetching messages by article ID and not messages in general.
 */
export const message = {
  getMessagesByArticleId: async (
    baseUrl: string,
    params: GetMessagesByArticleIdParams
  ): Promise<GetMessagesByArticleIdResponse> => {
    return request('message.getMessagesByArticleId', params, baseUrl);
  },
};
