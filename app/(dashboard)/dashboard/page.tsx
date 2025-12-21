"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowRight } from 'lucide-react';

const data = [
    { name: 'Mon', players: 400, views: 2400 },
    { name: 'Tue', players: 300, views: 1398 },
    { name: 'Wed', players: 200, views: 9800 },
    { name: 'Thu', players: 278, views: 3908 },
    { name: 'Fri', players: 189, views: 4800 },
    { name: 'Sat', players: 239, views: 3800 },
    { name: 'Sun', players: 349, views: 4300 },
];

const StatCard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean }> = ({ title, value, trend, isPositive }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all">
        <div className="flex flex-col gap-1">
            <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</h3>
            <p className="text-3xl font-display font-bold text-slate-900">{value}</p>
            <span className={`text-xs font-bold flex items-center gap-1 w-fit px-2 py-0.5 rounded-full mt-2 ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                <TrendingUp className="w-3 h-3" /> {trend}
            </span>
        </div>
    </div>
);

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Organizer Dashboard</h2>
                    <p className="text-slate-500">Overview of your Mobile Legends: Bang Bang tournaments.</p>
                </div>
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-brand-500/20">
                    Generate Monthly Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Tournaments" value="12" trend="+3 this week" isPositive={true} />
                <StatCard title="Total Registrations" value="1,284" trend="+12.5%" isPositive={true} />
                <StatCard title="Total Views" value="45.2K" trend="-2.4%" isPositive={false} />
                <StatCard title="Prize Pool (RM)" value="RM 25k" trend="Stable" isPositive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-display font-bold text-slate-900">Viewer Engagement (MY Region)</h3>
                        <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Views" />
                                <Area type="monotone" dataKey="players" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPlayers)" name="Players" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-display font-bold text-slate-900">Live Matches</h3>
                        <button className="text-brand-600 text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-red-500 animate-pulse uppercase flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Live
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">MPL MY Season 13</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col items-center gap-1 w-16">
                                        <img src={`https://ui-avatars.com/api/?name=Todak&background=0D8ABC&color=fff`} className="w-10 h-10 rounded-full shadow-sm" alt="Team 1" />
                                        <span className="text-xs font-bold text-slate-700">TDK</span>
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-lg font-mono font-bold text-slate-800 tracking-widest shadow-sm">
                                        2 - 1
                                    </div>
                                    <div className="flex flex-col items-center gap-1 w-16">
                                        <img src={`https://ui-avatars.com/api/?name=Selangor+Red+Giants&background=ff0000&color=fff`} className="w-10 h-10 rounded-full shadow-sm" alt="Team 2" />
                                        <span className="text-xs font-bold text-slate-700">SRG</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl bg-white text-brand-600 hover:bg-brand-50 hover:text-brand-700 transition-all flex items-center justify-center gap-2 text-sm font-bold border border-brand-200 shadow-sm">
                        Go to Match Center <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
