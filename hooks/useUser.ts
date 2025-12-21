"use client";

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase';

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createBrowserClient();

        // Get initial session
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
    };
}

export default useUser;
