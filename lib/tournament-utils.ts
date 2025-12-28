// ============================================================================
// FILE: lib/tournament-utils.ts
// ============================================================================
import { Tournament, TournamentStatus, GameType } from '@/types';

export const getStatusBadgeClass = (status: TournamentStatus) => {
  switch (status) {
    case TournamentStatus.ONGOING:
      return 'bg-red-500 text-white animate-pulse';
    case TournamentStatus.COMPLETED:
      return 'bg-slate-600 text-white';
    case TournamentStatus.DRAFT:
      return 'bg-slate-400 text-white';
    case TournamentStatus.REGISTRATION_CLOSED:
      return 'bg-orange-500 text-white';
    case TournamentStatus.PUBLISHED:
      return 'bg-brand-500 text-white';
    default:
      return 'bg-brand-500 text-white';
  }
};

export const getStatusLabel = (status: TournamentStatus) => {
  switch (status) {
    case TournamentStatus.PUBLISHED:
      return 'Open for Registration';
    case TournamentStatus.REGISTRATION_CLOSED:
      return 'Registration Closed';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const getStatusEnum = (dbStatus: string): TournamentStatus => {
  return dbStatus as TournamentStatus;
};

export const normalizeTournamentData = (rawData: any[]): Tournament[] => {
  // Sort by newest first
  rawData.sort((a, b) =>
    new Date(b.created_at || b.start_date).getTime() -
    new Date(a.created_at || a.start_date).getTime()
  );

  return rawData.map((raw): Tournament => ({
    id: raw.id,
    name: raw.name,
    game: 'Mobile Legends: Bang Bang',
    participants: raw.teams?.[0]?.count || 0,
    maxParticipants: raw.max_teams,
    status: getStatusEnum(raw.status),
    startDate: raw.start_date,
    prizePool: raw.prize_pool ? `RM ${raw.prize_pool}` : 'RM 0',
    type: GameType.MOBA,
    description: raw.description,
    rules: raw.rules,
    format: raw.format,
    registrationDeadline: raw.registration_deadline
  }));
};