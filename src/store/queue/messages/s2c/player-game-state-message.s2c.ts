import { MatchmakingMode } from "@/api/mapped-models";

export class PlayerGameStateMessageS2C {
  constructor(
    public readonly serverUrl: string,
    public readonly matchId: number,
    public readonly lobbyType: MatchmakingMode,
    public readonly abandoned: boolean,
  ) {}
}
