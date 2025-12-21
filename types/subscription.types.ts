export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface PricingPlan {
    id: string;
    name: string;
    tier: SubscriptionTier;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    features: string[];
    limits: PlanLimits;
    isPopular?: boolean;
}

export interface PlanLimits {
    maxTournaments: number;
    maxParticipantsPerTournament: number;
    maxTeamMembers: number;
    hasAIFeatures: boolean;
    hasCustomBranding: boolean;
    hasPrioritySupport: boolean;
    hasAnalytics: boolean;
    hasAPIAccess: boolean;
}

export interface Subscription {
    id: string;
    userId: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}
