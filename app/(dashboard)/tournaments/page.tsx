"use client";

import React, { useState } from 'react';
import { Plus, Sparkles, Calendar, Users, Trophy, Loader2, LayoutGrid, List } from 'lucide-react';
import { GameType, Tournament, TournamentStatus } from '@/types';
import { generateTournamentDetails } from '@/lib/services/gemini.service';

const mockTournaments: Tournament[] = [
    {
        id: '1',
        name: 'MPL MY Season 13 Qualifiers',
        game: 'Mobile Legends: Bang Bang',
        type: GameType.MOBA,
        participants: 64,
        maxParticipants: 128,
        status: TournamentStatus.ONGOING,
        startDate: '2024-03-15',
        prizePool: 'RM 100,000',
    },
    {
        id: '2',
        name: 'Community Cup: Johor Bahru',
        game: 'Mobile Legends: Bang Bang',
        type: GameType.MOBA,
        participants: 32,
        maxParticipants: 32,
        status: TournamentStatus.COMPLETED,
        startDate: '2024-02-20',
        prizePool: 'RM 5,000',
    },
    {
        id: '3',
        name: 'Uni-League Championship',
        game: 'Mobile Legends: Bang Bang',
        type: GameType.MOBA,
        participants: 12,
        maxParticipants: 16,
        status: TournamentStatus.UPCOMING,
        startDate: '2024-04-01',
        prizePool: 'RM 15,000',
    },
];

export default function TournamentsPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [tournaments, setTournaments] = useState(mockTournaments);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Form State
    const [newName, setNewName] = useState('');
    const [newGame, setNewGame] = useState('Mobile Legends: Bang Bang');
    const [newDescription, setNewDescription] = useState('');
    const [newRules, setNewRules] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateAI = async () => {
        if (!newName || !newGame) return;
        setIsGenerating(true);
        const details = await generateTournamentDetails(newGame, newName);
        if (details) {
            setNewDescription(details.description);
            setNewRules(details.rules);
        }
        setIsGenerating(false);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newTournament: Tournament = {
            id: Date.now().toString(),
            name: newName,
            game: newGame,
            type: GameType.MOBA,
            participants: 0,
            maxParticipants: 64,
            status: TournamentStatus.UPCOMING,
            startDate: new Date().toISOString().split('T')[0],
            prizePool: 'RM 0',
            description: newDescription,
            rules: newRules
        };
        setTournaments([newTournament, ...tournaments]);
        setIsCreating(false);
        // Reset form
        setNewName('');
        setNewDescription('');
        setNewRules('');
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">My Tournaments</h2>
                    <p className="text-slate-500">Manage your MLBB tournaments across Malaysia.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Create Tournament
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Trophy className="w-64 h-64 text-brand-500 transform rotate-12 translate-x-12 -translate-y-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create New MLBB Tournament</h3>
                            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-slate-600 text-sm font-semibold mb-2">Tournament Name</label>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                        placeholder="e.g., KL Major 2024"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-600 text-sm font-semibold mb-2">Game Title</label>
                                    <input
                                        type="text"
                                        value={newGame}
                                        onChange={(e) => setNewGame(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* AI Generation Section */}
                            <div className="bg-gradient-to-r from-brand-50 to-white border border-brand-100 rounded-xl p-5">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-slate-900 block">Gemini AI Assistant</span>
                                            <span className="text-xs text-slate-500">Auto-generate rules & descriptions</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGenerateAI}
                                        disabled={!newName || !newGame || isGenerating}
                                        className="text-xs bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        {isGenerating ? 'Generating...' : 'Generate Details'}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-500 text-xs uppercase font-bold mb-2">Description</label>
                                        <textarea
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-purple-500/50 min-h-[80px]"
                                            placeholder="AI will generate a hype description here..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 text-xs uppercase font-bold mb-2">Rules</label>
                                        <textarea
                                            value={newRules}
                                            onChange={(e) => setNewRules(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-purple-500/50 min-h-[80px]"
                                            placeholder="AI will list key rules here..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all">
                                Launch Tournament
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((t) => (
                        <div key={t.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-all hover:shadow-lg">
                            <div className="h-32 bg-slate-900 relative overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" alt="Cover" />
                                <div className="absolute bottom-4 left-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${t.status === TournamentStatus.ONGOING ? 'bg-red-500 text-white animate-pulse' :
                                            t.status === TournamentStatus.COMPLETED ? 'bg-slate-600 text-white' :
                                                'bg-brand-500 text-white'
                                        }`}>
                                        {t.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-display font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">{t.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{t.game}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-brand-500" />
                                            <span className="font-medium">{t.participants}/{t.maxParticipants} Teams</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-yellow-500" />
                                            <span className="font-medium">{t.prizePool}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{t.startDate}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors">
                                    Manage Dashboard
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tournament Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Participants</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Prize Pool</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tournaments.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status === TournamentStatus.ONGOING ? 'bg-red-100 text-red-800' :
                                                t.status === TournamentStatus.COMPLETED ? 'bg-slate-100 text-slate-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                                        <div className="text-xs text-slate-500">{t.game}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {t.startDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">
                                        {t.participants}/{t.maxParticipants}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                                        {t.prizePool}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-brand-600 hover:text-brand-900 font-semibold">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
