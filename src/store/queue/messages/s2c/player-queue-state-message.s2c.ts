import { MatchmakingMode } from "@/api/mapped-models";

export class PlayerQueueStateMessageS2C {
  constructor(
    public readonly partyId: string,
    public readonly modes: MatchmakingMode[],
    public readonly inQueue: boolean,
  ) {}
}
