import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";

export class EnterQueueMessageC2S {
  constructor(
    public readonly mode: MatchmakingMode,
    public readonly version: Dota2Version,
  ) {}
}
