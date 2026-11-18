import { RankingEntryDTO } from './constants.dto';
/**
 * Skill names served by user.getUserSkills (matches gameConfig `skills` keys).
 */
export type SkillName =
    | "energy"
    | "stamina"
    | "health"
    | "hunger"
    | "attack"
    | "companies"
    | "production"
    | "criticalChance"
    | "criticalDamages"
    | "armor"
    | "precision"
    | "dodge"
    | "lootChance"
    | "management";

/**
 * Skill stat interface - Represents a single skill with all its modifiers and values.
 * Modifier fields are only present on the skills they apply to.
 */
export interface SkillStatDTO {
    level: number;
    /** Prestige tier invested in this skill. */
    prestige?: number;
    /** Absent on some armor/dodge entries. */
    value?: number;
    total: number;
    /** attack only. */
    ammoPercent?: number;
    buffsPercent?: number;
    debuffsPercent?: number;
    militaryRankPercent?: number;
    /** attack, criticalChance. */
    weapon?: number | null;
    /** armor, dodge, criticalDamages, precision. */
    equipment?: number | null;
    overflow?: number;
    limited?: number;
    /** Strategic-resource bonus. */
    strategic?: number;
    /** Temporary part that expires at `skillsExpiration.<skill>.tournament`. */
    tournament?: number;
    /** armor, dodge. */
    totalAfterSoftCap?: number;
    /** Bar skills: energy, stamina, health, hunger, production. */
    currentBarValue?: number;
    hourlyBarRegen?: number;
}

/**
 * Player leveling / skill-point state.
 */
export interface UserLevelingDTO {
    level: number;
    prestigeLevel: number;
    prestige: number;
    xp: number;
    totalXp: number;
    dailyXpLeft: number;
    availableSkillPoints: number;
    spentSkillPoints: number;
    totalSkillPoints: number;
    freeReset: number;
}

/**
 * User dates. ISO date strings; event-based keys are only present once the event has happened.
 */
export interface UserDatesDTO {
    lastConnectionAt: string;
    lastNotificationsCheckAt: string;
    lastCountryMessageCheckAt: string;
    lastGlobalMessageCheckAt: string;
    lastEventsCheckAt: string;
    citizenSince?: string;
    lastCitizenshipChangeAt?: string;
    lastTakingControlAt?: string;
    lastWorkAt?: string;
    lastDailyRewardClaimedAt?: string;
    lastDailyCalendarClaimedAt?: string;
    lastHelpAskedAt?: string;
    lastFreeTravelHomeAt?: string;
    lastComebackClaimedAt?: string;
    lastFiredFromGovAt?: string;
    lastGdprExportAt?: string;
    lastSeenGovernmentAnnouncementAt?: string;
    lastSeenAnnouncementAt?: string;
    lastManagerCareAt?: string;
    lastSkillsResetAt?: string;
    prestigeXpCompensatedAt?: string;
    missionXpCompensatedAt?: string;
    comebackPendingGapDays?: number;
}

/**
 *User DTO - Represents a user as returned by user.getUserLite.
 * `skills` and `skillsExpiration` moved to user.getUserSkills.
 */
export interface UserDTO {
    _id: string;
    username: string;
    country: string;
    isActive: boolean;
    avatarUrl?: string;
    animatedAvatarUrl?: string;
    mu?: string;
    createdAt: string; // ISO date string
    dates: UserDatesDTO;
    leveling: UserLevelingDTO;
    stats?: {
        damagesCount?: number;
    };
    rankings?: {
        userLevel: RankingEntryDTO;
        userReferrals: RankingEntryDTO;
        userWealth: RankingEntryDTO;
        weeklyUserDamages?: RankingEntryDTO;
        userDamages?: RankingEntryDTO;
        userSubscribers?: RankingEntryDTO;
        userTerrain?: RankingEntryDTO;
        userPremiumMonths?: RankingEntryDTO;
        userPremiumGifts?: RankingEntryDTO;
        userCasesOpened?: RankingEntryDTO;
        userGemsPurchased?: RankingEntryDTO;
        userBounty?: RankingEntryDTO;
        userMercenaryEarnings?: RankingEntryDTO;
        userSkinsOwned?: RankingEntryDTO;
        userMilestoneTiers?: RankingEntryDTO;
        userMissionsClaimed?: RankingEntryDTO;
    };
    militaryRank: number;
    infos?: {
      isPremium?: boolean;
      premiumMonthsCount?: number;
      premiumGiftsCount?: number;
      colorScheme?: string;
      font?: string;
      description?: string;
      banner?: string;
      usernameEffect?: string;
      adminType?: string;
      isBanned?: boolean;
      tournamentWonAt?: string;
      vicePresidentOf?: string;
      congressMemberOf?: string;
      minOfEconomyOf?: string;
      ministerOf?: string;
      ministerTitle?: string;
    };
    equippedSkinKeys?: Partial<Record<
      | "ammo" | "boots" | "chest" | "gloves" | "gun" | "heavyAmmo" | "helmet"
      | "jet" | "knife" | "lightAmmo" | "pants" | "rifle" | "sniper" | "tank",
      string
    >>;
    buffs?: {
      debuffEndAt?: string;
      debuffCodes?: string[]; // cocain is pill
      debuffWarningNotifiedAt?: string;
      buffEndAt?: string;
      buffCodes?: string[]; // cocain is pill
    };
  };

/**
 * Response for user.getUserLite endpoint
 */
export interface GetUserLiteResponse {
    result: {
        data: UserDTO;
    }
}

/**
 * User skills DTO - returned by user.getUserSkills.
 */
export interface UserSkillsDTO {
    _id: string;
    skills: Record<SkillName, SkillStatDTO>;
    /**
     * Keyed by skill. Each entry maps a temporary-bonus source (e.g. `tournament`) to the ISO
     * date it expires; entries can be empty. Absent for some users.
     */
    skillsExpiration?: Partial<Record<SkillName, Record<string, string>>>;
    leveling: UserLevelingDTO;
    dates: {
        lastSkillsResetAt?: string; // ISO date string
    };
}

/**
 * Response for user.getUserSkills endpoint
 */
export interface GetUserSkillsResponse {
    result: {
        data: UserSkillsDTO;
    }
}

/**
 * Parameters for user.getUsersByCountry
 */
export interface GetUsersByCountryParams {
  countryId: string;
  cursor?: string;
  limit?: number;
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

