/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";
import {
  GameFound,
  LauncherServerStarted,
  PartyInviteReceivedMessage,
  QueueStateMessage,
  ReadyCheckUpdate,
  RoomState,
} from "@/util/messages";

export abstract class GameCoordinatorListener {
  onConnected() {}

  onAuthorized() {}

  onDisconnected() {}

  onQueueUpdate(evt: {
    mode: MatchmakingMode;
    version: Dota2Version;
    inQueue: number;
  }) {}

  onPartyUpdated() {}

  onGameFound(gf: GameFound) {}

  onMatchFinished() {}

  onMatchState(url?: string) {}

  onQueueState(qsm: QueueStateMessage) {}

  onRoomNotReady() {}

  onRoomState(state?: RoomState) {}

  onPartyInviteReceived(t: PartyInviteReceivedMessage) {}

  onReadyCheckUpdate(data: ReadyCheckUpdate) {}

  onServerReady(data: LauncherServerStarted) {}

  onPartyInviteExpired(id: string) {}
}
