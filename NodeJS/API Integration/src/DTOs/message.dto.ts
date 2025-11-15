/**
 * Message DTO - Represents a message/comment on an article
 */
export interface MessageDTO {
  _id: string;
  user: string;
  article: string;
  message: string;
  upVotes: string[];
  responses: string[];
  isSoftDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/**
 * Response for message.getMessagesByArticleId endpoint
 */
export interface GetMessagesByArticleIdResponse {
  result: {
    data: {
      items: MessageDTO[];
    };
  };
}
