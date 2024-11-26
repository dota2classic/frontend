import { MatchmakingMode } from "@/api/mapped-models";

export enum ReadyState {
  READY,
  DECLINE,
  TIMEOUT,
  PENDING,
}
export class PlayerRoomEntry {
  constructor(
    public readonly steamId: string,
    public readonly state: ReadyState,
  ) {}
}

export class PlayerRoomStateMessageS2C {
  constructor(
    public readonly roomId: string,
    public readonly mode: MatchmakingMode,
    public readonly entries: PlayerRoomEntry[],
  ) {}
}
