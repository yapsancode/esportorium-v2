"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MoreVertical, Shield, Loader2, Plus } from 'lucide-react';
import { Team, Player, Tournament } from '@/types';
import { tournamentService } from '@/lib/services/tournament-service';
import { normalizeTournamentData } from '@/lib/tournament-utils';
import TeamManagementDialog from '@/components/tournaments/TeamManagementDialog';
import { Button } from '@/components/ui/button';

export default function TeamsPage() {
    const searchParams = useSearchParams();
    const tournamentId = searchParams.get('id');
    const [teams, setTeams] = useState<Team[]>([]);
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const fetchData = async () => {
        if (!tournamentId) return;
        setLoading(true);
        try {
            const [tData, tTeams] = await Promise.all([
                tournamentService.getTournament(tournamentId),
                tournamentService.fetchTournamentTeams(tournamentId)
            ]);

            if (tData) {
                const normalized = normalizeTournamentData([tData]);
                setTournament(normalized[0]);
            }
            setTeams(tTeams);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tournamentId]);

    const handleCreateTeam = () => {
        setSelectedTeam(null);
        setIsDialogOpen(true);
    };

    const handleEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setIsDialogOpen(true);
    };

    const handleSaveTeam = async (teamData: Partial<Team>, players: Partial<Player>[]) => {
        if (!tournamentId) return;

        let teamId = teamData.id;
        if (selectedTeam) {
            await tournamentService.updateTeam(teamId!, teamData);
        } else {
            const res = await tournamentService.addTeam(tournamentId, teamData);
            if (res.data) teamId = res.data.id;
        }

        if (!teamId) return;

        // Player Sync Logic
        // 1. Get current players from the selected team (if any/fetched)
        // Note: players in 'teams' state might be outdated if we don't refresh, 
        // but 'selectedTeam' was passed from that state.

        const existingPlayers = selectedTeam?.players || [];
        const desiredPlayers = players;

        // Find players to delete (exist in DB but not in desired list)
        // We use IDs. New players have IDs starting with 'temp-' or undefined.
        const toDelete = existingPlayers.filter(ep => !desiredPlayers.find(dp => dp.id === ep.id));
        for (const p of toDelete) {
            await tournamentService.deletePlayer(p.id);
        }

        // Find players to add
        for (const p of desiredPlayers) {
            if (!p.id || p.id.startsWith('temp-')) {
                await tournamentService.addPlayer(teamId, p);
            }
            // We skip updates for existing players for simplicity in this iteration
        }

        await fetchData();
    };

    const handleDeleteTeam = async () => {
        if (selectedTeam && selectedTeam.id) {
            await tournamentService.deleteTeam(selectedTeam.id);
            await fetchData();
        }
    };

    if (!tournamentId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
                <h2 className="text-xl font-bold text-slate-700">No Tournament Selected</h2>
                <p className="text-slate-500">Please select a tournament from the dashboard to view teams.</p>
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
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                        {tournament?.name ? `${tournament.name} - Teams` : 'Registered Teams'}
                    </h2>
                    <p className="text-slate-500">Manage teams for {tournament?.name || 'this tournament'}.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto items-center">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-brand-500 transition-colors shadow-sm"
                        />
                    </div>
                    <Button onClick={handleCreateTeam} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> Add Team
                    </Button>
                </div>
            </div>

            {teams.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 mb-4">No teams registered yet.</p>
                    <Button onClick={handleCreateTeam} variant="outline">Register First Team</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teams.map((team) => (
                        <div key={team.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center hover:border-brand-300 transition-all hover:shadow-lg hover:-translate-y-1 relative group cursor-pointer" onClick={() => handleEditTeam(team)}>
                            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                            <div className="relative mb-4">
                                <img src={team.avatar} alt={team.name} className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-md object-cover" />
                                {team.players && team.players.length >= 5 && (
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-2 border-white">
                                        <Shield className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                {(!team.players || team.players.length < 5) && (
                                    <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-1.5 border-2 border-white">
                                        <Shield className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">{team.name}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md mb-4 ${team.rank?.includes('Glory') ? 'bg-purple-100 text-purple-700' :
                                    team.rank?.includes('Mythic') ? 'bg-pink-100 text-pink-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>{team.rank}</span>

                            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Players</p>
                                    <p className={`text-lg font-mono font-bold ${(!team.players || team.players.length < 5) ? 'text-amber-600' : 'text-slate-700'}`}>
                                        {team.players?.length || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</p>
                                    <p className="text-lg font-mono font-bold text-slate-700">{team.winRate}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TeamManagementDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                team={selectedTeam}
                isCreating={!selectedTeam}
                onSave={handleSaveTeam}
                onDelete={selectedTeam ? handleDeleteTeam : undefined}
            />
        </div>
    );
}
