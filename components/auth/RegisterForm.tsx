"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const supabase = createBrowserClient();
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        username: formData.username,
                        display_name: formData.username,
                    },
                },
            });

            if (error) throw error;

            // Show success message - user needs to confirm email
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Check your email</h3>
                <p className="text-slate-500">
                    We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>.
                    Please click the link to verify your account.
                </p>
                <Link
                    href="/login"
                    className="inline-block text-brand-600 font-semibold hover:underline mt-4"
                >
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="MPL_Organizer"
                required
            />

            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="organizer@esports.my"
                required
            />

            <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
            />

            <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
            />

            <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                isLoading={isLoading}
                rightIcon={!isLoading && <ChevronRight className="w-4 h-4" />}
            >
                Create Account
            </Button>

            <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-600 font-bold hover:underline">
                    Sign In
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;
