"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trophy, Loader2 } from 'lucide-react';
import { Match, Tournament } from '@/types';
import { tournamentService } from '@/lib/services/tournament-service';
import { normalizeTournamentData } from '@/lib/tournament-utils';

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
    const searchParams = useSearchParams();
    const tournamentId = searchParams.get('id');
    const [matches, setMatches] = useState<Record<string, Match[]>>({ quarterfinals: [], semifinals: [], finals: [] });
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [champion, setChampion] = useState<any>(null);

    useEffect(() => {
        if (!tournamentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [tData, mData] = await Promise.all([
                    tournamentService.getTournament(tournamentId),
                    tournamentService.fetchTournamentMatches(tournamentId)
                ]);

                if (tData) {
                    const normalized = normalizeTournamentData([tData]);
                    setTournament(normalized[0]);
                }

                // Group matches
                const grouped: Record<string, Match[]> = { quarterfinals: [], semifinals: [], finals: [] };
                mData.forEach((m: Match) => {
                    // Assuming simplistic round mapping for now: 1=QF, 2=SF, 3=Finals
                    // Improve this logic based on actual maxParticipants if needed
                    if (m.round === 1) grouped.quarterfinals.push(m);
                    else if (m.round === 2) grouped.semifinals.push(m);
                    else if (m.round === 3) grouped.finals.push(m);
                });
                setMatches(grouped);

                // Determine champion
                const finalMatch = grouped.finals[0];
                if (finalMatch && finalMatch.status === 'Finished' && finalMatch.winnerId) {
                    const isP1 = finalMatch.winnerId === finalMatch.player1?.id;
                    setChampion(isP1 ? finalMatch.player1 : finalMatch.player2);
                } else {
                    setChampion(null);
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tournamentId]);

    if (!tournamentId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
                <h2 className="text-xl font-bold text-slate-700">No Tournament Selected</h2>
                <p className="text-slate-500">Please select a tournament from the dashboard to view brackets.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 animate-fade-in">
                <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{tournament?.name ? `${tournament.name} - Brackets` : 'Tournament Bracket'}</h2>
                    <p className="text-slate-500">{tournament?.format || 'Single Elimination'} - Playoffs</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 text-sm font-medium shadow-sm">Reset</button>
                    <button className="px-4 py-2 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 text-sm shadow-lg shadow-brand-500/20">Save Changes</button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
                <div className="inline-flex gap-8 min-h-[500px] px-8 py-4">
                    {matches.quarterfinals.length > 0 && (
                        <>
                            <BracketColumn title="Quarterfinals" matches={matches.quarterfinals} />
                            <div className="w-px bg-slate-200" />
                        </>
                    )}
                    {matches.semifinals.length > 0 && (
                        <>
                            <BracketColumn title="Semifinals" matches={matches.semifinals} />
                            <div className="w-px bg-slate-200" />
                        </>
                    )}

                    <BracketColumn title="Grand Finals" matches={matches.finals} isLast />

                    <div className="flex items-center justify-center pl-8">
                        <div className="text-center opacity-80">
                            <div className="bg-yellow-100 p-6 rounded-full mb-4 inline-block">
                                <Trophy className="w-16 h-16 text-yellow-600" />
                            </div>
                            <p className="text-xl font-display font-bold text-slate-900">CHAMPION</p>
                            <p className="text-slate-500 font-medium">
                                {champion ? champion.name : 'TBD'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
