// src/resources/workOffer.ts

import { request } from '../request';

/**
 * Functions related to the work offer resource.
 */
export const workOffer = {
  getById: async (baseUrl: string, id: string) => {
    return request('workOffer.getById', { id }, baseUrl);
  },
  getWorkOfferByCompanyId: async (baseUrl: string, companyId: string) => {
    return request('workOffer.getWorkOfferByCompanyId', { companyId }, baseUrl);
  },
  getWorkOffersPaginated: async (baseUrl: string, page: number, limit: number) => {
    return request('workOffer.getWorkOffersPaginated', { page, limit }, baseUrl);
  },
};