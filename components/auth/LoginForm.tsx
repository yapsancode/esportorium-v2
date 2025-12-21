"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';

interface LoginFormProps {
    redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo = '/dashboard' }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push(redirectTo);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organizer@esports.my"
                required
            />

            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    Remember me
                </label>
                <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                rightIcon={!isLoading && <ChevronRight className="w-4 h-4" />}
            >
                Sign In
            </Button>

            <div className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-brand-600 font-bold hover:underline">
                    Sign Up
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
