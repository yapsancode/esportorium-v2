import { PricingPlan } from '@/types';

export const PRICING_PLANS: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        tier: 'free',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'MYR',
        features: [
            'Up to 2 tournaments',
            'Up to 32 participants per tournament',
            'Basic bracket management',
            'Community support',
        ],
        limits: {
            maxTournaments: 2,
            maxParticipantsPerTournament: 32,
            maxTeamMembers: 1,
            hasAIFeatures: false,
            hasCustomBranding: false,
            hasPrioritySupport: false,
            hasAnalytics: false,
            hasAPIAccess: false,
        },
    },
    {
        id: 'pro',
        name: 'Pro Organizer',
        tier: 'pro',
        priceMonthly: 199,
        priceYearly: 1990,
        currency: 'MYR',
        isPopular: true,
        features: [
            'Unlimited tournaments',
            'Up to 256 participants per tournament',
            'Advanced AI analytics',
            'Custom branding',
            'Priority support (MY)',
            'Team collaboration (up to 5)',
        ],
        limits: {
            maxTournaments: -1, // unlimited
            maxParticipantsPerTournament: 256,
            maxTeamMembers: 5,
            hasAIFeatures: true,
            hasCustomBranding: true,
            hasPrioritySupport: true,
            hasAnalytics: true,
            hasAPIAccess: false,
        },
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tier: 'enterprise',
        priceMonthly: 599,
        priceYearly: 5990,
        currency: 'MYR',
        features: [
            'Everything in Pro',
            'Unlimited participants',
            'Full API access',
            'White-label solution',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
        ],
        limits: {
            maxTournaments: -1,
            maxParticipantsPerTournament: -1,
            maxTeamMembers: -1,
            hasAIFeatures: true,
            hasCustomBranding: true,
            hasPrioritySupport: true,
            hasAnalytics: true,
            hasAPIAccess: true,
        },
    },
];

export const getPlanById = (id: string): PricingPlan | undefined => {
    return PRICING_PLANS.find((plan) => plan.id === id);
};

export const getPlanByTier = (tier: string): PricingPlan | undefined => {
    return PRICING_PLANS.find((plan) => plan.tier === tier);
};
