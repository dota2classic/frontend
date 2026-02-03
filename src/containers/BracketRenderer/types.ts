import { UserDTO } from "@/api/back";

export interface TournamentBracketDto {
  participant: RichParticipant[];
  stage: Stage[];
  group: Group[];
  round: Round[];
  match: Match[];
  match_game: MatchGame[];
}

export interface RichParticipant {
  id: number;
  tournament_id: number;
  name: string;
  image_url?: string;
  players: UserDTO[];
}

export interface Stage {
  id: number;
  tournament_id: number;
  name: string;
  type: StageType;
  number: number;
  settings: StageSettings;
}

export type StageType = "single_elimination" | "double_elimination";

export interface StageSettings {
  size: number;
  seedOrdering: SeedOrdering[];
  grandFinal: GrandFinalType;
  matchesChildCount: number;
}

export type SeedOrdering = "natural" | "reverse" | "reverse_half_shift";

export type GrandFinalType = "single" | "double";
export interface Group {
  id: number;
  stage_id: number;
  number: number;
}

export interface Group {
  id: number;
  stage_id: number;
  number: number;
}

export interface Round {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
}

export interface Match {
  id: number;
  number: number;
  stage_id: number;
  group_id: number;
  round_id: number;
  child_count: number;
  status: MatchStatus;
  opponent1: MatchOpponent | null;
  opponent2: MatchOpponent | null;
}

export enum MatchStatus {
  Unknown = 0,
  Ready = 1,
  Running = 2,
  Completed = 3,
  Archived = 4,
}

export interface MatchOpponent {
  id: number | null;
  position?: number;
  score?: number;
  result?: MatchResult;
}

export type MatchResult = "win" | "loss";

export interface MatchGame {
  id: number;
  match_id: number;
  // extend when schema is known
}
