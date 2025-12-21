"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Trophy, Users, GitGraph, Medal, LogOut, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Participants', path: '/participants', icon: Users },
    { name: 'Brackets', path: '/brackets', icon: GitGraph },
    { name: 'Leaderboard', path: '/leaderboard', icon: Medal },
    { name: 'Profile', path: '/profile', icon: User },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col shadow-lg z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Header with Logo and Collapse Toggle */}
            <div className="p-4 border-b border-slate-100 h-20">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-3">
                        <div className="min-w-[2rem] w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center transform rotate-3">
                            <Trophy className="text-white w-5 h-5" />
                        </div>
                        {!isCollapsed && (
                            <h1 className="text-xl font-display font-bold text-slate-800 tracking-wider whitespace-nowrap overflow-hidden">
                                ESPORT<span className="text-brand-600">ORIUM</span>
                            </h1>
                        )}
                    </div>

                    {/* Enhanced Collapse Toggle Button */}
                    <button
                        onClick={toggleCollapse}
                        className={`
                            flex items-center justify-center
                            w-8 h-8 rounded-lg
                            bg-slate-100 hover:bg-brand-50
                            text-slate-500 hover:text-brand-600
                            border border-slate-200 hover:border-brand-200
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            ${isCollapsed ? 'mx-auto' : ''}
                        `}
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2 overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            title={isCollapsed ? item.name : ''}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap ${isActive
                                ? 'bg-brand-50 text-brand-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            <div className={`${isCollapsed ? 'mx-auto' : ''}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            </div>
                            {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors whitespace-nowrap ${isCollapsed ? 'justify-center' : ''
                        }`}
                    title={isCollapsed ? 'Sign Out' : ''}
                >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
