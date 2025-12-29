// export enum TournamentStatus {
//   UPCOMING = 'Upcoming',
//   ONGOING = 'Ongoing',
//   COMPLETED = 'Completed',
//   CANCELLED = 'Cancelled',
//   DRAFT = 'Draft',
// }

// types/index.ts (or wherever your types are defined)
export enum TournamentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REGISTRATION_CLOSED = 'registration_closed',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

export enum GameType {
  MOBA = 'MOBA',
  FPS = 'FPS',
  FIGHTING = 'Fighting',
  RACING = 'Racing',
  SPORTS = 'Sports'
}

export interface Player {
  id: string;
  name: string;
  ign?: string; // In-Game Name
  role?: string;
  avatar?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  avatar: string; // Team Logo
  rank?: string;
  winRate?: number;
  players?: Player[];
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  type: GameType;
  participants: number; // Current teams count
  maxParticipants: number; // Max teams
  status: TournamentStatus;
  startDate: string;
  prizePool: string;
  description?: string;
  rules?: string;
  format?: string;
  registrationDeadline?: string;
}

export interface Match {
  id: string;
  round: number;
  player1: Team | null;
  player2: Team | null;
  score1: number;
  score2: number;
  winnerId?: string;
  status: 'Scheduled' | 'Live' | 'Finished';
}

export interface LeaderboardEntry {
  rank: number;
  player: Team;
  points: number;
  tournamentsPlayed: number;
  wins: number;
}
