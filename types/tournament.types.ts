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

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  rank?: string;
  winRate?: number;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  type: GameType;
  participants: number;
  maxParticipants: number;
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
  player1: Participant | null;
  player2: Participant | null;
  score1: number;
  score2: number;
  winnerId?: string;
  status: 'Scheduled' | 'Live' | 'Finished';
}

export interface LeaderboardEntry {
  rank: number;
  player: Participant;
  points: number;
  tournamentsPlayed: number;
  wins: number;
}
