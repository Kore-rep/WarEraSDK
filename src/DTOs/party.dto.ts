// Possible values are -2, -1, 0, 1, 2
export interface EthicsDTO {
    militarism: number;
    isolationism: number;
    imperialism: number;
    industrialism: number;
    unethical: boolean;
}

export interface PartyDTO {
    ethics: EthicsDTO;
    _id: string;
    name: string;
    description: string;
    country: string; // country ID
    region: string; // region ID
    leader: string; // user ID
    councilMembers: string[]; // user IDs
    members: string[]; // user IDs
    createdAt: string;
    updatedAt: string;
    __v: number;
    avatarUrl: string;
    primaryWinner: string; // User Id
}

export interface GetAllPartiesResponse {
    result: {
        data: PartyDTO[];
    }
}

export interface GetPartyByIdResponse {
    result: {
        data: PartyDTO;
    }
}