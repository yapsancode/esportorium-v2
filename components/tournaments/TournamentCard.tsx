// ============================================================================
// FILE: components/tournaments/TournamentCard.tsx
// ============================================================================
import { Users, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { Tournament } from '@/types';
import { getStatusBadgeClass, getStatusLabel } from '@/lib/tournament-utils';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentCard({ tournament, onSelect }: TournamentCardProps) {
  return (
    <div onClick={() => onSelect(tournament)} className="block group cursor-pointer">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-all hover:shadow-xl">
        <div className="h-32 bg-slate-900 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
            alt="Tournament cover"
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(tournament.status)}`}>
              {getStatusLabel(tournament.status)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-display font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
            {tournament.name}
          </h3>
          <p className="text-slate-500 text-sm mb-4">{tournament.game}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" />
                <span className="font-medium">
                  {tournament.participants}/{tournament.maxParticipants} Teams
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{tournament.prizePool}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span>{tournament.startDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-brand-600 text-sm font-semibold group-hover:text-brand-700">
              Manage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}