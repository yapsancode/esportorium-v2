"use client";

import React from 'react';
import { Search, Filter, MoreVertical, Shield } from 'lucide-react';
import { Participant } from '@/types';

const mockPlayers: Participant[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i.toString(),
    name: `Summoner_${i + 1}`,
    avatar: `https://ui-avatars.com/api/?name=Player+${i + 1}&background=random&color=fff`,
    rank: i < 3 ? 'Mythical Glory' : i < 6 ? 'Mythic' : 'Legend',
    winRate: 45 + Math.floor(Math.random() * 20)
}));

export default function ParticipantsPage() {
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Registered Players</h2>
                    <p className="text-slate-500">Manage participants for upcoming MLBB events.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search players..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-colors shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockPlayers.map((player) => (
                    <div key={player.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-brand-300 transition-all hover:shadow-lg hover:-translate-y-1 relative group">
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="relative mb-4">
                            <img src={player.avatar} alt={player.name} className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-md" />
                            <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border-2 border-white">
                                <Shield className="w-3 h-3 text-brand-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{player.name}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md mb-4 ${player.rank === 'Mythical Glory' ? 'bg-purple-100 text-purple-700' :
                                player.rank === 'Mythic' ? 'bg-pink-100 text-pink-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>{player.rank}</span>

                        <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</p>
                                <p className="text-lg font-mono font-bold text-slate-700">{player.winRate}%</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tournaments</p>
                                <p className="text-lg font-mono font-bold text-slate-700">4</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
