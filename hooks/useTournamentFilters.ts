// ============================================================================
// FILE: hooks/useTournamentFilters.ts
// ============================================================================
import { useState, useMemo } from 'react';
import { Tournament, TournamentStatus } from '@/types';

type StatusFilter = 'all' | TournamentStatus;
type ViewMode = 'grid' | 'list';

export function useTournamentFilters(tournaments: Tournament[]) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tournaments, statusFilter, searchQuery]);

  return {
    filteredTournaments,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
  };
}