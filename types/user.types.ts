export type UserRole = 'organizer' | 'participant' | 'admin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    userId: string;
    displayName: string;
    avatar?: string;
    location?: string;
    bio?: string;
    isVerified: boolean;
    organizationName?: string;
}

export interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
