// ============================================================================
// FILE: components/tournaments/TournamentGrid.tsx
// ============================================================================
import { Tournament } from '@/types';
import TournamentCard from './TournamentCard';

interface TournamentGridProps {
  tournaments: Tournament[];
  onSelect: (tournament: Tournament) => void;
}

export default function TournamentGrid({ tournaments, onSelect }: TournamentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}