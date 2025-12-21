import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

interface CardHeaderProps {
    className?: string;
    children: React.ReactNode;
}

interface CardContentProps {
    className?: string;
    children: React.ReactNode;
}

interface CardFooterProps {
    className?: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => {
    return (
        <div
            className={`bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${className}`}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => {
    return (
        <div className={`p-6 border-b border-slate-100 ${className}`}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
    return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => {
    return (
        <div className={`p-6 border-t border-slate-100 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
