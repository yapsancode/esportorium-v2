// ============================================================================
// FILE: constants/tournaments.ts
// ============================================================================
import { TournamentStatus } from '@/types';

export const STATUS_OPTIONS = [
  TournamentStatus.PUBLISHED,
  TournamentStatus.ONGOING,
  TournamentStatus.COMPLETED,
  TournamentStatus.DRAFT,
] as const;

export const MAX_TEAMS_OPTIONS = [
  { value: 16, label: '16 Teams' },
  { value: 32, label: '32 Teams' },
  { value: 64, label: '64 Teams' },
  { value: 128, label: '128 Teams' },
  { value: 256, label: '256 Teams' },
] as const;

export const FORMAT_OPTIONS = [
  { value: 'single-elimination', label: 'Single Elimination' },
  { value: 'double-elimination', label: 'Double Elimination' },
  { value: 'round-robin', label: 'Round Robin' },
  { value: 'swiss', label: 'Swiss System' },
  { value: 'groups-playoffs', label: 'Group Stage + Playoffs' },
] as const;

export const STATUS_SELECT_OPTIONS = [
  { value: TournamentStatus.DRAFT, label: 'Draft' },
  { value: TournamentStatus.PUBLISHED, label: 'Published' },
  { value: TournamentStatus.REGISTRATION_CLOSED, label: 'Reg Closed' },
  { value: TournamentStatus.ONGOING, label: 'Ongoing' },
  { value: TournamentStatus.COMPLETED, label: 'Completed' },
] as const;
