'use client';

import * as React from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Constants
const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[0-9]/, text: 'At least 1 number' },
    { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
    { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    { regex: /[!-\/:-@[-`{-~]/, text: 'At least 1 special character' },
] as const;

type StrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

const STRENGTH_CONFIG = {
    colors: {
        0: 'bg-border',
        1: 'bg-red-500',
        2: 'bg-orange-500',
        3: 'bg-amber-500',
        4: 'bg-amber-700',
        5: 'bg-emerald-500',
    } satisfies Record<StrengthScore, string>,
    texts: {
        0: 'Enter a password',
        1: 'Weak password',
        2: 'Medium password!',
        3: 'Strong password!',
        4: 'Very Strong password!',
    } satisfies Record<Exclude<StrengthScore, 5>, string>,
} as const;

// Types
type Requirement = {
    met: boolean;
    text: string;
};

type PasswordStrength = {
    score: StrengthScore;
    requirements: Requirement[];
};

export interface PasswordStrengthInputProps
    extends Omit<React.ComponentProps<'input'>, 'type'> {
    showStrengthMeter?: boolean;
    showRequirements?: boolean;
}

const PasswordStrengthInput = React.forwardRef<HTMLInputElement, PasswordStrengthInputProps>(
    ({ className, value, showStrengthMeter = true, showRequirements = true, ...props }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false);

        // Use the value prop (controlled) or empty string
        const passwordValue = typeof value === 'string' ? value : '';

        const calculateStrength = React.useMemo((): PasswordStrength => {
            const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
                met: req.regex.test(passwordValue),
                text: req.text,
            }));

            return {
                score: requirements.filter((req) => req.met).length as StrengthScore,
                requirements,
            };
        }, [passwordValue]);

        return (
            <div className="w-full space-y-2">
                <div className="relative w-full">
                    <input
                        ref={ref}
                        type={isVisible ? 'text' : 'password'}
                        value={value}
                        data-slot="input"
                        aria-invalid={calculateStrength.score < 4}
                        aria-describedby="password-strength"
                        className={cn(
                            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                            className
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setIsVisible((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        tabIndex={-1}
                        aria-label={isVisible ? 'Hide password' : 'Show password'}
                    >
                        {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                {showStrengthMeter && passwordValue && (
                    <div
                        className="h-1 rounded-full bg-border overflow-hidden"
                        role="progressbar"
                        aria-valuenow={calculateStrength.score}
                        aria-valuemin={0}
                        aria-valuemax={5}
                    >
                        <div
                            className={`h-full ${STRENGTH_CONFIG.colors[calculateStrength.score]} transition-all duration-500`}
                            style={{ width: `${(calculateStrength.score / 5) * 100}%` }}
                        />
                    </div>
                )}

                {showStrengthMeter && passwordValue && (
                    <p
                        id="password-strength"
                        className="text-xs font-medium flex justify-between text-muted-foreground"
                    >
                        <span>Must contain:</span>
                        <span className={calculateStrength.score >= 4 ? 'text-emerald-600' : ''}>
                            {STRENGTH_CONFIG.texts[Math.min(calculateStrength.score, 4) as keyof typeof STRENGTH_CONFIG.texts]}
                        </span>
                    </p>
                )}

                {showRequirements && passwordValue && (
                    <ul className="space-y-1" aria-label="Password requirements">
                        {calculateStrength.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? (
                                    <Check size={14} className="text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <X size={14} className="text-muted-foreground/80 flex-shrink-0" />
                                )}
                                <span
                                    className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}
                                >
                                    {req.text}
                                    <span className="sr-only">
                                        {req.met ? ' - Requirement met' : ' - Requirement not met'}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
);

PasswordStrengthInput.displayName = 'PasswordStrengthInput';

export { PasswordStrengthInput };

// Export helper to check if password meets all requirements
export function isPasswordStrong(password: string): boolean {
    return PASSWORD_REQUIREMENTS.every((req) => req.regex.test(password));
}
