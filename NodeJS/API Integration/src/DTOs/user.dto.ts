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
        energy: {
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
            };
        health: {
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
            };
        hunger: {
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
            };
        attack: {
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
            };
        companies: {
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
            };
        entrepreneurship: {
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
            };
        production: {
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
            };
        criticalChance: {
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
            };
        criticalDamages: {
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
            };
        armor: {
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
            };
        precision: {
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
            };
        dodge: {
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
            };
        lootChance: {
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
            };
    };
    rankings: {
        userDamages: {
            value: number;
            rank: number;
            tier: string;
        };
        weeklyUserDamages: {
            value: number;
            rank: number;
            tier: string;
        };
        userWealth: {
            value: number;
            rank: number;
            tier: string;
        };
        userLevel: {
            value: number;
            rank: number;
            tier: string;
        };
        userReferrals:{
            value: number;
            rank: number;
            tier: string;
        };
        userTerrain: {
            value: number;
            rank: number;
            tier: string;
        };
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
export interface UserByCountryDataDto {
  items: UserByCountryItemDto[];
  nextCursor: string | null;
}

/**
 * Response for user.getuserbycountry endpoint
 */
export interface UserByCountryResponseDto {
  result: {
    data: UserByCountryDataDto;
  };
}

