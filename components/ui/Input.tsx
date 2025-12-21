"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-slate-700 text-sm font-semibold mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-900 
              focus:outline-none focus:ring-2 transition-all
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/20'
                            }
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
