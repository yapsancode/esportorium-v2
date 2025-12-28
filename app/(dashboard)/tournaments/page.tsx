// ============================================================================
// FILE: app/(dashboard)/tournaments/page.tsx
// ============================================================================
"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Loader2, Trophy } from 'lucide-react';
import { useTournaments } from '@/hooks/useTournaments';
import { useTournamentFilters } from '@/hooks/useTournamentFilters';
import { useTournamentManagement } from '@/hooks/useTournamentManagement';
import ViewToggle from '@/components/tournaments/ViewToggle';
import TournamentFilters from '@/components/tournaments/TournamentFilters';
import TournamentGrid from '@/components/tournaments/TournamentGrid';
import TournamentList from '@/components/tournaments/TournamentList';
import TournamentManagementDialog from '@/components/tournaments/TournamentManagementDialog';

export default function TournamentsPage() {
  const { tournaments, loading } = useTournaments();
  const { 
    filteredTournaments, 
    viewMode, 
    setViewMode,
    statusFilter, 
    setStatusFilter,
    searchQuery, 
    setSearchQuery 
  } = useTournamentFilters(tournaments);
  
  const managementProps = useTournamentManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  const hasTournaments = filteredTournaments.length > 0;
  const hasFiltersApplied = searchQuery || statusFilter !== 'all';

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
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

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
      <TournamentFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Empty State */}
      {!hasTournaments && (
        <div className="text-center py-20">
          <Trophy className="w-32 h-32 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-700 mb-3">
            {hasFiltersApplied ? 'No tournaments found' : 'No tournaments yet'}
          </h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {hasFiltersApplied
              ? 'Try adjusting your filters or search query.'
              : 'Start organizing your first MLBB tournament today!'}
          </p>
          {!hasFiltersApplied && (
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

      {/* Tournament Views */}
      {hasTournaments && viewMode === 'grid' && (
        <TournamentGrid
          tournaments={filteredTournaments}
          onSelect={managementProps.setSelectedTournament}
        />
      )}

      {hasTournaments && viewMode === 'list' && (
        <TournamentList
          tournaments={filteredTournaments}
          onSelect={managementProps.setSelectedTournament}
        />
      )}

      {/* Management Dialog */}
      <TournamentManagementDialog {...managementProps} />
    </div>
  );
}