"use client";

import React from 'react';
import { Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/types';

const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, player: { id: '1', name: 'CikuGais', avatar: 'https://ui-avatars.com/api/?name=Ciku+Gais&background=random' }, points: 2450, tournamentsPlayed: 12, wins: 8 },
    { rank: 2, player: { id: '2', name: 'Momo', avatar: 'https://ui-avatars.com/api/?name=Momo&background=random' }, points: 2100, tournamentsPlayed: 10, wins: 6 },
    { rank: 3, player: { id: '3', name: 'Yums', avatar: 'https://ui-avatars.com/api/?name=Yums&background=random' }, points: 1950, tournamentsPlayed: 11, wins: 4 },
    { rank: 4, player: { id: '4', name: 'Rippo', avatar: 'https://ui-avatars.com/api/?name=Rippo&background=random' }, points: 1800, tournamentsPlayed: 15, wins: 3 },
    { rank: 5, player: { id: '5', name: 'Xorn', avatar: 'https://ui-avatars.com/api/?name=Xorn&background=random' }, points: 1650, tournamentsPlayed: 9, wins: 2 },
];

export default function LeaderboardPage() {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Global Leaderboard (MY)</h2>
                <p className="text-slate-500">Top performing Mobile Legends players this season.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Player</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Points</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Played</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Wins</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {mockLeaderboard.map((entry) => (
                            <tr key={entry.player.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                            entry.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                                entry.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'text-slate-500'
                                        }`}>
                                        {entry.rank <= 3 ? <Medal className="w-5 h-5" /> : `#${entry.rank}`}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full border border-slate-200" src={entry.player.avatar} alt="" />
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{entry.player.name}</div>
                                            <div className="text-xs text-slate-500">Gold Laner</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-lg font-mono font-bold text-brand-600">{entry.points.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                                    {entry.tournamentsPlayed}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                        {entry.wins}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
