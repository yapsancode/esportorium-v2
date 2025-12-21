export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',

    // Dashboard routes
    DASHBOARD: '/dashboard',
    TOURNAMENTS: '/tournaments',
    TOURNAMENT_DETAIL: (id: string) => `/tournaments/${id}`,
    TOURNAMENT_CREATE: '/tournaments/create',
    PARTICIPANTS: '/participants',
    BRACKETS: '/brackets',
    LEADERBOARD: '/leaderboard',
    PROFILE: '/profile',

    // Settings routes
    SETTINGS: '/settings',
    SETTINGS_BILLING: '/settings/billing',
    SETTINGS_ORGANIZATION: '/settings/organization',
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [
    ROUTES.DASHBOARD,
    ROUTES.TOURNAMENTS,
    ROUTES.PARTICIPANTS,
    ROUTES.BRACKETS,
    ROUTES.LEADERBOARD,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
];
