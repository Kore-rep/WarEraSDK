/**
 * Skill stat interface - Represents a single skill with all its modifiers and values
 */
export interface SkillStatDTO {
    level: number;
    ammoPercent: number | null;
    buffsPercent: number | null;
    debuffsPercent: number | null;
    value: number | null;
    weapon: number | null;
    equipment: number | null;
    limited: number | null;
    total: number;
    currentBarValue?: number;
    hourlyBarRegen?: number;
}

/**
 * Ranking entry interface - Represents a user's ranking in a specific category
 */
export interface RankingEntryDTO {
    value: number;
    rank: number;
    tier: string;
}

/**
 *User DTO - Represents a user
 */
export interface UserDTO {
    _id: string;
    username: string;
    country: string;
    isActive: boolean;
    avatarUrl: string;
    mu: string;
    createdAt: string; // ISO date string
    dates: {
        lastConnectionAt: string; // ISO date string
        lastNotificationsCheckAt: string; // ISO date string
        lastCountryMessageCheckAt: string; // ISO date string
        lastGlobalMessageCheckAt: string; // ISO date string
        lastEventsCheckAt: string; // ISO date string
        lastWorkOfferApplications: string; // ISO date string
        lastWorkAt: string; // ISO date string
        lastDailyRewardClaimedAt: string; // ISO date string
        lastSkillsResetAt: string; // ISO date string
        lastHelpAskedAt: string; // ISO date string
        lastCitizenshipChangeAt: string; // ISO date string
        lastTakingControlAt: string; // ISO date string
    };
    leveling: {
        level: number;
        totalXp: number;
        dailyXpLeft: number;
        availableSkillPoints: number;
        spentSkillPoints: number;
        totalSkillPoints: number;
        freeReset: number;
    };
    skills:  {
        energy: SkillStatDTO;
        health: SkillStatDTO;
        hunger: SkillStatDTO;
        attack: SkillStatDTO;
        companies: SkillStatDTO;
        entrepreneurship: SkillStatDTO;
        production: SkillStatDTO;
        criticalChance: SkillStatDTO;
        criticalDamages: SkillStatDTO;
        armor: SkillStatDTO;
        precision: SkillStatDTO;
        dodge: SkillStatDTO;
        lootChance: SkillStatDTO;
    };
    rankings: {
        userDamages: RankingEntryDTO;
        weeklyUserDamages: RankingEntryDTO;
        userWealth: RankingEntryDTO;
        userLevel: RankingEntryDTO;
        userReferrals: RankingEntryDTO;
        userTerrain: RankingEntryDTO;
    };
}
/**
 * Response for user.getUserLite endpoint
 */
export interface GetUserLiteResponse {
    result: {
        data: UserDTO;  
    }
}

/**
 *A single user entry returned from getUsersByCountry
 */ 

export interface UserByCountryItemDto {
  _id: string;
  createdAt: string; // ISO date string
}
/**
 *All data returned from getUsersByCountry
 */ 
export interface UsersByCountryDataDto {
  items: UserByCountryItemDto[];
  nextCursor: string | null;
}

/**
 * Response for user.getUsersByCountry endpoint
 */
export interface UsersByCountryResponseDto {
  result: {
    data: UsersByCountryDataDto;
  };
}

