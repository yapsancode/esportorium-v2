// ============================================================================
// FILE: components/tournaments/TournamentDetails.tsx
// ============================================================================
import { Users, Trophy, Edit, Trash2 } from 'lucide-react';
import { Tournament } from '@/types';
import { Button } from '@/components/ui/button';
import { getStatusBadgeClass, getStatusLabel } from '@/lib/tournament-utils';

interface TournamentDetailsProps {
  tournament: Tournament;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function TournamentDetails({ tournament, onEdit, onDelete, onClose }: TournamentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Status</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusBadgeClass(tournament.status)}`}>
            {getStatusLabel(tournament.status)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Participants</span>
          <span className="text-sm font-semibold text-slate-900">
            {tournament.participants} / {tournament.maxParticipants} Teams
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Prize Pool</span>
          <span className="text-sm font-semibold text-slate-900">{tournament.prizePool}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Start Date</span>
          <span className="text-sm font-semibold text-slate-900">{tournament.startDate}</span>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-auto py-3"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 text-slate-500" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900">Edit Details</span>
            <span className="text-xs text-slate-500">Update info & rules</span>
          </div>
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => window.location.href = `/tournaments/teams?id=${tournament.id}`}>
          <Users className="w-4 h-4 text-slate-500" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900">Teams</span>
            <span className="text-xs text-slate-500">View registered teams</span>
          </div>
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => window.location.href = `/tournaments/brackets?id=${tournament.id}`}>
          <Trophy className="w-4 h-4 text-slate-500" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-900">Bracket</span>
            <span className="text-xs text-slate-500">Manage matches</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-auto py-3 border-red-200 hover:bg-red-50 hover:text-red-600 group"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-red-600">Delete</span>
            <span className="text-xs text-red-400">Permanently remove</span>
          </div>
        </Button>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}