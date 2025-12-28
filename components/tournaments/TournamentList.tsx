    // ============================================================================
// FILE: components/tournaments/TournamentList.tsx
// ============================================================================
import { Tournament } from '@/types';
import { getStatusBadgeClass, getStatusLabel } from '@/lib/tournament-utils';

interface TournamentListProps {
  tournaments: Tournament[];
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentList({ tournaments, onSelect }: TournamentListProps) {
  return (
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
          {tournaments.map((tournament) => (
            <tr key={tournament.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(tournament.status)}`}>
                  {getStatusLabel(tournament.status)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-900">{tournament.name}</div>
                <div className="text-xs text-slate-500">{tournament.game}</div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{tournament.startDate}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {tournament.participants}/{tournament.maxParticipants}
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                {tournament.prizePool}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onSelect(tournament)}
                  className="text-brand-600 hover:text-brand-900 font-semibold text-sm"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}