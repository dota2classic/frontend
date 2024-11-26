import { OnlineUpdateMessageS2C } from "@/store/queue/messages/s2c/online-update-message.s2c";
import { PartyInviteExpiredMessageS2C } from "@/store/queue/messages/s2c/party-invite-expired-message.s2c";
import { PartyInviteReceivedMessageS2C } from "@/store/queue/messages/s2c/party-invite-received-message.s2c";
import { PlayerGameStateMessageS2C } from "@/store/queue/messages/s2c/player-game-state-message.s2c";
import { PlayerPartyInvitationsMessageS2C } from "@/store/queue/messages/s2c/player-party-invitations-message.s2c";
import { PlayerQueueStateMessageS2C } from "@/store/queue/messages/s2c/player-queue-state-message.s2c";
import { PlayerRoomStateMessageS2C } from "@/store/queue/messages/s2c/player-room-state-message.s2c";
import { QueueStateMessageS2C } from "@/store/queue/messages/s2c/queue-state-message.s2c";
import { PartyDto } from "@/api/back";
import { PlayerServerSearchingMessageS2C } from "@/store/queue/messages/s2c/player-server-searching-message.s2c";
import { PleaseEnterQueueMessageS2C } from "@/store/queue/messages/s2c/please-enter-queue-message.s2c";

export interface GameCoordinatorNewListener {
  onOnlineUpdate(msg: OnlineUpdateMessageS2C): void;

  onPartyInviteExpired(msg: PartyInviteExpiredMessageS2C): void;
  onPartyInviteReceived(msg: PartyInviteReceivedMessageS2C): void;
  onPlayerPartyInvitations(msg: PlayerPartyInvitationsMessageS2C): void;
  onPlayerPartyState(msg: PartyDto): void;

  onPlayerGameState(msg: PlayerGameStateMessageS2C | undefined): void;
  onPlayerGameReady(msg: PlayerGameStateMessageS2C): void;

  onPlayerServerSearching(msg: PlayerServerSearchingMessageS2C): void;

  onPlayerQueueState(msg: PlayerQueueStateMessageS2C | undefined): void;

  onPlayerRoomState(msg: PlayerRoomStateMessageS2C | undefined): void;
  onPlayerRoomFound(msg: PlayerRoomStateMessageS2C): void;

  onQueueState(msg: QueueStateMessageS2C): void;
  onPleaseEnterQueue(msg: PleaseEnterQueueMessageS2C): void;
  onConnectionComplete(): void;
}
