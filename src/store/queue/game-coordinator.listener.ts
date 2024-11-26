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
import { PlayerQueueStateMessageS2C } from "@/store/queue/messages/s2c/player-queue-state-message.s2c";

export abstract class GameCoordinatorListener {
  onConnected() {}

  onAuthorized() {}

  onDisconnected() {}

  onPlayerQueueState(evt: PlayerQueueStateMessageS2C | undefined) {}

  onPartyUpdated() {}

  onGameFound(gf: GameFound) {}

  onMatchFinished() {}

  onMatchState(url?: string) {}

  onRoomNotReady() {}

  onRoomState(state?: RoomState) {}

  onPartyInviteReceived(t: PartyInviteReceivedMessage) {}

  onReadyCheckUpdate(data: ReadyCheckUpdate) {}

  onServerReady(data: LauncherServerStarted) {}

  onPartyInviteExpired(id: string) {}
}
