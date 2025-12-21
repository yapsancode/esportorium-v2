"use client";

import React from 'react';
import { Trophy } from 'lucide-react';
import { Match, Participant } from '@/types';

const mockParticipant = (name: string): Participant => ({
    id: name, name, avatar: `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`,
});

const mockMatches: Record<string, Match[]> = {
    quarterfinals: [
        { id: '1', round: 1, player1: mockParticipant('Todak'), player2: mockParticipant('HomeBois'), score1: 2, score2: 0, winnerId: 'Todak', status: 'Finished' },
        { id: '2', round: 1, player1: mockParticipant('SMG'), player2: mockParticipant('Yoodo RG'), score1: 2, score2: 1, winnerId: 'SMG', status: 'Finished' },
        { id: '3', round: 1, player1: mockParticipant('RSG MY'), player2: mockParticipant('Team HAQ'), score1: 0, score2: 2, winnerId: 'Team HAQ', status: 'Finished' },
        { id: '4', round: 1, player1: mockParticipant('Lunatix'), player2: mockParticipant('Barracuda'), score1: 1, score2: 0, status: 'Live' }
    ],
    semifinals: [
        { id: '5', round: 2, player1: mockParticipant('Todak'), player2: mockParticipant('SMG'), score1: 0, score2: 0, status: 'Scheduled', winnerId: undefined },
        { id: '6', round: 2, player1: mockParticipant('Team HAQ'), player2: null, score1: 0, score2: 0, status: 'Scheduled', winnerId: undefined },
    ],
    finals: [
        { id: '7', round: 3, player1: null, player2: null, score1: 0, score2: 0, status: 'Scheduled', winnerId: undefined },
    ]
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden w-64 shadow-md mb-6 relative group hover:border-brand-400 hover:shadow-lg transition-all">
            {match.status === 'Live' && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}

            {/* Player 1 */}
            <div className={`p-3 flex justify-between items-center ${match.winnerId === match.player1?.id ? 'bg-brand-50' : ''}`}>
                <div className="flex items-center gap-3">
                    {match.player1 ? (
                        <>
                            <img src={match.player1.avatar} alt={match.player1.name} className="w-6 h-6 rounded-full border border-slate-200" />
                            <span className={`text-sm font-bold ${match.winnerId === match.player1.id ? 'text-brand-700' : 'text-slate-700'}`}>
                                {match.player1.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-slate-400 italic">TBD</span>
                    )}
                </div>
                <span className="font-mono font-bold text-slate-900">{match.player1 ? match.score1 : '-'}</span>
            </div>

            <div className="h-px bg-slate-100 mx-2" />

            {/* Player 2 */}
            <div className={`p-3 flex justify-between items-center ${match.winnerId === match.player2?.id ? 'bg-brand-50' : ''}`}>
                <div className="flex items-center gap-3">
                    {match.player2 ? (
                        <>
                            <img src={match.player2.avatar} alt={match.player2.name} className="w-6 h-6 rounded-full border border-slate-200" />
                            <span className={`text-sm font-bold ${match.winnerId === match.player2.id ? 'text-brand-700' : 'text-slate-700'}`}>
                                {match.player2.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-sm text-slate-400 italic">TBD</span>
                    )}
                </div>
                <span className="font-mono font-bold text-slate-900">{match.player2 ? match.score2 : '-'}</span>
            </div>
        </div>
    );
};

const BracketColumn: React.FC<{ title: string; matches: Match[]; isLast?: boolean }> = ({ title, matches, isLast }) => (
    <div className="flex flex-col items-center min-w-[300px]">
        <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8 bg-slate-100 px-3 py-1 rounded-full">{title}</h3>
        <div className={`flex flex-col justify-around h-full w-full items-center relative ${isLast ? '' : 'gap-8'}`}>
            {matches.map((m) => (
                <div key={m.id} className="relative flex items-center">
                    <MatchCard match={m} />
                    {!isLast && (
                        // Connector Lines
                        <div className="hidden lg:block absolute left-full top-1/2 w-8 h-px bg-slate-300 transform -translate-y-1/2" />
                    )}
                </div>
            ))}
        </div>
    </div>
);

export default function BracketsPage() {
    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Playoff Bracket</h2>
                    <p className="text-slate-500">MPL MY Season 13 - Playoffs</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 text-sm font-medium shadow-sm">Reset</button>
                    <button className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 text-sm shadow-lg shadow-brand-500/20">Save Changes</button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
                <div className="inline-flex gap-8 min-h-[500px] px-8 py-4">
                    <BracketColumn title="Quarterfinals" matches={mockMatches.quarterfinals} />
                    <div className="w-px bg-slate-200" />
                    <BracketColumn title="Semifinals" matches={mockMatches.semifinals} />
                    <div className="w-px bg-slate-200" />
                    <BracketColumn title="Grand Finals" matches={mockMatches.finals} isLast />
                    <div className="flex items-center justify-center pl-8">
                        <div className="text-center opacity-80">
                            <div className="bg-yellow-100 p-6 rounded-full mb-4 inline-block">
                                <Trophy className="w-16 h-16 text-yellow-600" />
                            </div>
                            <p className="text-xl font-display font-bold text-slate-900">CHAMPION</p>
                            <p className="text-slate-500 font-medium">TBD</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
