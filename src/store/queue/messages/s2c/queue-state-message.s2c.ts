import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";

export class QueueStateMessageS2C {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly version: Dota2Version,
    public readonly inQueue: number,
  ) {}
}
