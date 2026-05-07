export interface LawDataDTO {
    type: "declare_war" | "define_enemy_country" | "change_tax" | "set_color_scheme" | "sendMoneyToCountry" | "start_congress_election" | "start_president_election" | "transfer_region" | "accept_peace" | "impeach_president" | "impeach_congressman" | "propose_alliance" | "propose_peace" | "break_alliance" | "liberate_region",
    taxType: string;
    discordUrl: string;
    targetCountry: string; // country ID
    targetRegion: string; // region ID
}

export interface LawDTO {
    votes: {
        accept: string[];
        reject: string[];
        abstain: string[];
    };
    data: LawDataDTO;
    _id: string;
    country: string; // country ID
    status: "accepted" | "rejected" | "pending";
    user: string; // user ID
    text: string; // Description
    createdAt: Date;
    updatedAt: Date;
    endsAt: Date;
    vicePresidentVoted: boolean;
}

/**
 * Parameters for law.getPaginatedLaws endpoint
 */
export interface GetPaginatedLawsParams {
  countryId: string;
  limit?: number;
  cursor?: string;
  direction?: "forward" | "backward";
}

/**
 * Response for law.getPaginatedLaws endpoint
 */
export interface GetPaginatedLawsResponse {
  result: {
    data: {
      items: LawDTO[];
      nextCursor?: string;
    };
  };
}