import { SubscriptionTier, PlanLimits } from '@/types';

export const PLAN_LIMITS: Record<SubscriptionTier, PlanLimits> = {
    free: {
        maxTournaments: 2,
        maxParticipantsPerTournament: 32,
        maxTeamMembers: 1,
        hasAIFeatures: false,
        hasCustomBranding: false,
        hasPrioritySupport: false,
        hasAnalytics: false,
        hasAPIAccess: false,
    },
    pro: {
        maxTournaments: -1, // unlimited
        maxParticipantsPerTournament: 256,
        maxTeamMembers: 5,
        hasAIFeatures: true,
        hasCustomBranding: true,
        hasPrioritySupport: true,
        hasAnalytics: true,
        hasAPIAccess: false,
    },
    enterprise: {
        maxTournaments: -1,
        maxParticipantsPerTournament: -1,
        maxTeamMembers: -1,
        hasAIFeatures: true,
        hasCustomBranding: true,
        hasPrioritySupport: true,
        hasAnalytics: true,
        hasAPIAccess: true,
    },
};

export const isWithinLimit = (
    current: number,
    limit: number
): boolean => {
    if (limit === -1) return true; // unlimited
    return current < limit;
};

export const getLimitsForTier = (tier: SubscriptionTier): PlanLimits => {
    return PLAN_LIMITS[tier];
};

export const canCreateTournament = (
    tier: SubscriptionTier,
    currentCount: number
): boolean => {
    const limits = getLimitsForTier(tier);
    return isWithinLimit(currentCount, limits.maxTournaments);
};

export const canAddParticipant = (
    tier: SubscriptionTier,
    currentCount: number
): boolean => {
    const limits = getLimitsForTier(tier);
    return isWithinLimit(currentCount, limits.maxParticipantsPerTournament);
};
