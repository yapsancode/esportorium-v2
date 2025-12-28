// ============================================================================
// FILE: components/tournaments/TournamentFilters.tsx
// ============================================================================
import { Search } from 'lucide-react';
import { TournamentStatus } from '@/types';
import { STATUS_OPTIONS } from '@/constants/tournaments';
import { getStatusLabel } from '@/lib/tournament-utils';

type StatusFilter = 'all' | TournamentStatus;

interface TournamentFiltersProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TournamentFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: TournamentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            statusFilter === 'all'
              ? 'bg-brand-100 text-brand-700 border border-brand-300'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === status
                ? 'bg-brand-100 text-brand-700 border border-brand-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {getStatusLabel(status)}
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
  );
}