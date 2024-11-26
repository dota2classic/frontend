import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";

export class PlayerQueueStateMessageS2C {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly version: Dota2Version,
  ) {}
}
