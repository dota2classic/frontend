import { Dota2Version, MatchInfoDto } from "../api/back/models";
import { MatchmakingMode } from "@/api/mapped-models";

export class RoomState {
  constructor(
    public readonly playerId: { value: string },
    public readonly roomId: string,
    public readonly mode: MatchmakingMode,
    public readonly accepted: number,
    public readonly total: number,
    public readonly iAccepted: boolean,
  ) {}
}

export class PartyInviteReceivedMessage {
  constructor(
    public readonly partyId: string,
    public readonly leader: string,
    public readonly inviteId: string,
  ) {}
}

export enum Messages {
  AUTH = "AUTH",
  QUEUE_UPDATE = "QUEUE_UPDATE",
  ENTER_QUEUE = "ENTER_QUEUE",
  LEAVE_ALL_QUEUES = "LEAVE_ALL_QUEUES",
  GAME_FOUND = "GAME_FOUND",
  SET_READY_CHECK = "SET_READY_CHECK",
  READY_CHECK_UPDATE = "READY_CHECK_UPDATE",
  SERVER_STARTED = "SERVER_STARTED",
  ROOM_STATE = "ROOM_STATE",
  ROOM_NOT_READY = "ROOM_NOT_READY",
  QUEUE_STATE = "QUEUE_STATE",
  MATCH_FINISHED = "MATCH_FINISHED",
  MATCH_RESULTS_READY = "MATCH_RESULTS_READY",
  MATCH_STATE = "MATCH_STATE",
  BROWSER_AUTH = "BROWSER_AUTH",
  INVITE_TO_PARTY = "INVITE_TO_PARTY",
  PARTY_INVITE_RECEIVED = "PARTY_INVITE_RECEIVED",
  PARTY_INVITE_EXPIRED = "PARTY_INVITE_EXPIRED",
  ACCEPT_PARTY_INVITE = "ACCEPT_PARTY_INVITE",
  LEAVE_PARTY = "LEAVE_PARTY",
  PARTY_UPDATED = "PARTY_UPDATED",
  BAD_AUTH = "BAD_AUTH",
  ONLINE_UPDATE = "ONLINE_UPDATE",
}

export interface ReadyCheckUpdate {
  roomID: string;
  mode: MatchmakingMode;
  total: number;
  accepted: number;
}

export interface UpdateQueue {
  mode: MatchmakingMode;
  version: Dota2Version;
  inQueue: number;
}

export interface EnterQueue {
  mode: MatchmakingMode;
}

export interface GameFound {
  mode: MatchmakingMode;
  total: number;
  roomID: string;
  accepted: number;
}

export interface ReadyCheck {
  roomID: string;
  accept: boolean;
}

export interface LauncherServerStarted {
  url: string;
  info: MatchInfoDto;
}

export interface PartyInvite {
  id: string;
}
