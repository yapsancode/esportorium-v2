"use client";

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main
                className={`flex-1 p-8 overflow-y-auto h-screen bg-slate-50 relative transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <div className="relative z-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
