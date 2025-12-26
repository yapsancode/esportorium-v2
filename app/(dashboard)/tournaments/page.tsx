"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Users, Trophy, LayoutGrid, List, Search, Loader2 } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase'; // Your client
import { GameType, Tournament, TournamentStatus } from '@/types';

type StatusFilter = 'all' | TournamentStatus;

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions: StatusFilter[] = [
    'all',
    TournamentStatus.DRAFT,
    TournamentStatus.UPCOMING,
    TournamentStatus.ONGOING,
    TournamentStatus.COMPLETED,
    TournamentStatus.CANCELLED,
  ];
  const supabase = supabaseBrowser();

  const mapDbStatusToEnum = (dbStatus: string): TournamentStatus => {
    switch (dbStatus.toLowerCase()) {
      case 'published':
        return TournamentStatus.UPCOMING;
      case 'ongoing':
        return TournamentStatus.ONGOING;
      case 'completed':
        return TournamentStatus.COMPLETED;
      case 'cancelled':
        return TournamentStatus.CANCELLED;
      case 'draft':
        return TournamentStatus.DRAFT;
      default:
        return TournamentStatus.DRAFT; // fallback
    }
  };

  // Fetch tournaments + participant count
  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Query 1: Tournaments where user is creator
      const { data: createdTournaments } = await supabase
        .from('tournaments')
        .select(`
      id,
      name,
      max_teams,
      status,
      start_date,
      prize_pool,
      teams(count)
    `)
        .eq('creator_id', user.id);

      // Query 2: Tournaments where user is co-organizer
      const { data: coOrganizedTournaments } = await supabase
        .from('tournament_organizers')
        .select(`
      tournament:tournament_id (
        id,
        name,
        max_teams,
        status,
        start_date,
        prize_pool,
        teams(count)
      )
    `)
        .eq('user_id', user.id);

      // Combine and dedupe by id
      const allTournaments = [
        ...(createdTournaments || []),
        ...(coOrganizedTournaments?.map((co: { tournament: any; }) => co.tournament) || [])
      ];

      // Dedupe in case user is both creator and co-organizer
      const uniqueMap = new Map();
      allTournaments.forEach(t => {
        if (t && t.id) {
          uniqueMap.set(t.id, t);
        }
      });

      const uniqueTournaments = Array.from(uniqueMap.values());

      // Sort by newest first
      uniqueTournaments.sort((a, b) =>
        new Date(b.created_at || b.start_date).getTime() -
        new Date(a.created_at || a.start_date).getTime()
      );

      // Format for UI
      // Normalize data shape (both queries return slightly different structures)
      const normalized = uniqueTournaments.map((raw: any) => ({
        id: raw.id,
        name: raw.name,
        max_teams: raw.max_teams,
        status: raw.status,
        start_date: raw.start_date,
        prize_pool: raw.prize_pool || null,
        teams: raw.teams || [], // ensure teams array exists
      }));

      const formatted: Tournament[] = normalized.map((t): Tournament => ({
        id: t.id,
        name: t.name,
        game: 'Mobile Legends: Bang Bang',
        participants: t.teams[0]?.count || 0,
        maxParticipants: t.max_teams,
        status: mapDbStatusToEnum(t.status),
        startDate: t.start_date,
        prizePool: t.prize_pool ? `RM ${t.prize_pool}` : 'RM 0',
        type: GameType.MOBA
      }));

      setTournaments(formatted);
      setLoading(false);
    };

    fetchTournaments();

    // Realtime subscription
    const channel = supabase
      .channel('tournaments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tournaments',
        },
        () => fetchTournaments() // refetch on any change
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        () => fetchTournaments() // update participant count live
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Client-side filtering
  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tournaments, statusFilter, searchQuery]);

  const hasTournaments = filteredTournaments.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
            My Tournaments
          </h2>
          <p className="text-slate-500">Manage your MLBB tournaments across Malaysia.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <Link
            href="/tournaments/create"
            className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'DRAFT'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === filter
                ? 'bg-brand-100 text-brand-700 border border-brand-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournaments..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {!hasTournaments && (
        <div className="text-center py-20">
          <Trophy className="w-32 h-32 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-700 mb-3">
            {searchQuery || statusFilter !== 'all'
              ? 'No tournaments found'
              : 'No tournaments yet'}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters or search query.'
              : 'Start organizing your first MLBB tournament today!'}
          </p>
          {(searchQuery || statusFilter !== 'all') ? null : (
            <Link
              href="/tournaments/create"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Tournament
            </Link>
          )}
        </div>
      )}

      {/* Grid View */}
      {hasTournaments && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((t) => (
            <Link href={`/tournaments/${t.id}`} key={t.id} className="block group">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-all hover:shadow-xl">
                <div className="h-32 bg-slate-900 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
                    alt="Tournament cover"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${t.status === TournamentStatus.ONGOING
                      ? 'bg-red-500 text-white animate-pulse'
                      : t.status === TournamentStatus.COMPLETED
                        ? 'bg-slate-600 text-white'
                        : 'bg-brand-500 text-white'
                      }`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-display font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {t.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{t.game}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-500" />
                        <span className="font-medium">
                          {t.participants}/{t.maxParticipants} Teams
                        </span>
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

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-brand-600 text-sm font-semibold group-hover:text-brand-700">
                      Manage Dashboard →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {hasTournaments && viewMode === 'list' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tournament</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Teams</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Prize</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTournaments.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${t.status === TournamentStatus.ONGOING
                      ? 'bg-red-500 text-white animate-pulse'
                      : t.status === TournamentStatus.COMPLETED
                        ? 'bg-slate-600 text-white'
                        : 'bg-brand-500 text-white'
                      }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.game}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.startDate}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {t.participants}/{t.maxParticipants}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {t.prizePool}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/tournaments/${t.id}`}
                      className="text-brand-600 hover:text-brand-900 font-semibold text-sm"
                    >
                      Manage →
                    </Link>
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