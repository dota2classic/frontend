import { MatchmakingMode } from "@/api/mapped-models";

export class EnterQueueMessageC2S {
  constructor(public readonly modes: MatchmakingMode[]) {}
}
