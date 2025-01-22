import { HydratableStore } from "@/store/HydratableStore";
import { io, Socket } from "socket.io-client";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { getApi } from "@/api/hooks";
import { AuthStore } from "@/store/AuthStore";
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";
import {
  BanStatusDto,
  CurrentOnlineDto,
  PartyDto,
  PartyMemberDTO,
} from "@/api/back";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { DefaultQueueHolder } from "@/store/queue/mock";
import { Sounds } from "@/const/sounds";
import { NotificationDto, NotificationStore } from "@/store/NotificationStore";
import { getPartyAccessLevel, isPartyInGame } from "@/util/party";
import { PlayerQueueStateMessageS2C } from "@/store/queue/messages/s2c/player-queue-state-message.s2c";
import { GameCoordinatorNewListener } from "@/store/queue/game-coordinator-new.listener";
import { OnlineUpdateMessageS2C } from "@/store/queue/messages/s2c/online-update-message.s2c";
import { PartyInviteExpiredMessageS2C } from "@/store/queue/messages/s2c/party-invite-expired-message.s2c";
import { PartyInviteReceivedMessageS2C } from "@/store/queue/messages/s2c/party-invite-received-message.s2c";
import { PlayerGameStateMessageS2C } from "@/store/queue/messages/s2c/player-game-state-message.s2c";
import { PlayerPartyInvitationsMessageS2C } from "@/store/queue/messages/s2c/player-party-invitations-message.s2c";
import {
  PlayerRoomStateMessageS2C,
  ReadyState,
} from "@/store/queue/messages/s2c/player-room-state-message.s2c";
import { QueueStateMessageS2C } from "@/store/queue/messages/s2c/queue-state-message.s2c";
import { MessageTypeS2C } from "@/store/queue/messages/s2c/message-type.s2c";
import { MessageTypeC2S } from "@/store/queue/messages/c2s/message-type.c2s";
import { SetReadyCheckMessageC2S } from "@/store/queue/messages/c2s/set-ready-check-message.c2s";
import { InviteToPartyMessageC2S } from "@/store/queue/messages/c2s/invite-to-party-message.c2s";
import { AcceptPartyInviteMessageC2S } from "@/store/queue/messages/c2s/accept-party-invite-message.c2s";
import { PlayerServerSearchingMessageS2C } from "@/store/queue/messages/s2c/player-server-searching-message.s2c";
import { PartyInviteNotification, PleaseQueueNotification } from "@/components";
import { EnterQueueMessageC2S } from "@/store/queue/messages/c2s/enter-queue-message.c2s";
import { PleaseEnterQueueMessageS2C } from "@/store/queue/messages/s2c/please-enter-queue-message.s2c";
import { metrika } from "@/ym";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { blinkTab } from "@/util/blinkTab";
import { GameModeAccessLevel } from "@/const/game-mode-access-level";
import BrowserCookies from "browser-cookies";
import { modEnableCondition } from "@/components/MatchmakingOption/utils";

export type QueueHolder = {
  [key: string]: number;
};

interface QueueStoreHydrateProps {
  party?: PartyDto;
  defaultModes: MatchmakingMode[];
}

export class QueueStore
  implements
    HydratableStore<QueueStoreHydrateProps>,
    GameCoordinatorNewListener
{
  // public static UNRANKED_QUEUE_HOURS = [
  //   17, 18, 19, 20, 21, 22, 23, 24, 0, 1, 2, 3,
  // ];
  // public static UTC_OFFSET = -3 * 60; // MOSCOW, aka UTC + 3

  @observable
  public selectedModes: MatchmakingMode[] = [];
  @observable
  public readyState: GameCoordinatorState = GameCoordinatorState.DISCONNECTED;
  @observable
  public inQueue: QueueHolder = DefaultQueueHolder;

  @observable
  public connected: boolean = false;

  @observable
  public online: string[] = [];

  private matchSound!: HTMLAudioElement;
  private roomReadySound!: HTMLAudioElement;
  private partyInviteReceivedSound!: HTMLAudioElement;

  private socket!: Socket;

  @observable
  public party: PartyDto | undefined = undefined;

  @observable
  public queueState: PlayerQueueStateMessageS2C | undefined = undefined;

  @observable
  public gameState: PlayerGameStateMessageS2C | undefined = undefined;

  @observable
  public roomState: PlayerRoomStateMessageS2C | undefined = undefined;

  @observable
  public serverSearching: boolean = false;

  @observable
  public onlineData: CurrentOnlineDto | undefined = undefined;

  private scheduler!: ToadScheduler;

  constructor(
    private readonly authStore: AuthStore,
    private readonly notify: NotificationStore,
  ) {
    makeAutoObservable(this);

    if (typeof window === "undefined") return;

    this.matchSound = new Audio(Sounds.MATCH_GAME);
    this.roomReadySound = new Audio(Sounds.NOTIFY_GAME);

    this.partyInviteReceivedSound = new Audio(Sounds.PARTY_INVITE);
    this.partyInviteReceivedSound.volume = 0.4;

    this.connect();

    this.fetchParty().finally();

    this.scheduler = new ToadScheduler();
    this.scheduler.addIntervalJob(
      new SimpleIntervalJob(
        { seconds: 5 },
        new AsyncTask(
          "invalidate party on ban expire",
          this.refetchPartyOnBanEnd,
          (err) => {
            console.error("There was an error checking party", err);
          },
        ),
      ),
    );

    this.scheduler.addIntervalJob(
      new SimpleIntervalJob(
        { seconds: 5, runImmediately: true },
        new AsyncTask("refresh online stats", this.updateOnlineStats, (err) => {
          console.error("There was an error updating stats", err);
        }),
      ),
    );
    // this.scheduler.addIntervalJob(
    //   new SimpleIntervalJob(
    //     { seconds: 1 },
    //     new Task("Update unranked time queue", () => {
    //       runInAction(() => {
    //         this.isUnrankedQueueOpen = QueueStore.UNRANKED_QUEUE_HOURS.includes(
    //           toMoscowTime(new Date().toISOString()).getHours(),
    //         );
    //       });
    //     }),
    //   ),
    // );
  }

  private updateOnlineStats = async () => {
    await getApi()
      .statsApi.statsControllerOnline()
      .then((data) => runInAction(() => (this.onlineData = data)))
      .catch();
  };

  private refetchPartyOnBanEnd = async () => {
    if (!this.party) return;
    const shouldExpire =
      this.partyBanStatus?.isBanned &&
      this.party.players.findIndex((player) => {
        if (!player.banStatus.isBanned) return false;
        // If end time is in past
        return new Date(player.banStatus.bannedUntil) < new Date();
      }) !== -1;

    if (shouldExpire) {
      this.fetchParty().finally();
    }
  };

  @computed
  public get partyBanStatus(): BanStatusDto | undefined {
    let ban: BanStatusDto | undefined;
    if (this.authStore.me?.banStatus?.isBanned) {
      ban = this.authStore.me!.banStatus;
    } else if (this.party) {
      const activeBan = this.party?.players?.find(
        (t: PartyMemberDTO) => t.banStatus?.isBanned,
      );
      ban = activeBan?.banStatus;
    }
    return ban;
  }

  @computed
  public get partyAccessLevel(): GameModeAccessLevel {
    return this.party
      ? getPartyAccessLevel(this.party)
      : GameModeAccessLevel.NOTHING;
  }

  @computed
  public get isPartyInGame(): boolean {
    return this.party ? isPartyInGame(this.party) : true;
  }

  @computed
  public get selectedModeBanned(): boolean {
    return this.partyBanStatus?.isBanned || false;
  }

  @computed
  public get allowedSelectedModes(): MatchmakingMode[] {
    return this.selectedModes.filter((mode) => !modEnableCondition(this, mode));
  }

  @computed
  public get iAccepted(): boolean {
    return this.roomState
      ? this.roomState.entries.findIndex(
          (t) =>
            t.steamId === this.authStore.parsedToken?.sub &&
            t.state === ReadyState.READY,
        ) !== -1
      : false;
  }

  @computed
  public get allAccepted(): boolean {
    return this.roomState
      ? this.roomState.entries.filter((t) => t.state === ReadyState.READY)
          .length === this.roomState.entries.length
      : false;
  }

  @computed
  public get needAuth(): boolean {
    return !this.authStore.isAuthorized;
  }

  @computed
  public get ready(): boolean {
    return (
      this.readyState === GameCoordinatorState.CONNECTION_COMPLETE &&
      this.party !== undefined &&
      !this.needAuth
    );
  }

  @action
  public cancelSearch() {
    this.socket.emit(MessageTypeC2S.LEAVE_ALL_QUEUES);
  }

  @action
  public startSearch = () => {
    this.socket.emit(
      MessageTypeC2S.ENTER_QUEUE,
      new EnterQueueMessageC2S(this.allowedSelectedModes),
    );
  };

  @action
  public acceptGame = () => {
    if (!this.roomState) return;
    this.acceptPendingGame(this.roomState.roomId);
    metrika("reachGoal", "ACCEPT_GAME");
  };

  @action
  public declineGame = () => {
    if (!this.roomState) return;
    this.declinePendingGame(this.roomState.roomId);
  };

  // @action
  public enterQueue(): boolean {
    try {
      if (this.canQueue()) {
        this.startSearch();
        return true;
      } else {
        return false;
      }
    } catch (e: unknown) {
      console.warn(e);
      return true;
    }
  }

  public acceptPendingGame = (roomId: string) => {
    this.socket.emit(
      MessageTypeC2S.SET_READY_CHECK,
      new SetReadyCheckMessageC2S(roomId, true),
    );
  };

  public declinePendingGame = (roomId: string) => {
    this.socket.emit(
      MessageTypeC2S.SET_READY_CHECK,
      new SetReadyCheckMessageC2S(roomId, false),
    );
  };

  @action
  public inviteToParty = (id: string) => {
    this.socket.emit(
      MessageTypeC2S.INVITE_TO_PARTY,
      new InviteToPartyMessageC2S(id),
    );
  };

  public submitPartyInvite = (id: string, accept: boolean) => {
    this.socket.emit(
      MessageTypeC2S.ACCEPT_PARTY_INVITE,
      new AcceptPartyInviteMessageC2S(id, accept),
    );
  };

  public leaveParty = () => {
    this.socket.emit(MessageTypeC2S.LEAVE_PARTY);
  };

  public async connect() {
    if (this.socket && this.socket.connected) return;

    // Make sure token is not stale
    await this.authStore.fetchMe();

    this.socket = io("wss://dotaclassic.ru", {
      path: "/newsocket",
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token: this.authStore.token,
      },
    });

    this.socket.on("connect", this.onConnected);

    this.socket.connect();

    this.socket.on("disconnect", () => {
      this.onDisconnected();
      this.connected = false;
    });

    this.socket.on(
      MessageTypeS2C.CONNECTION_COMPLETE,
      this.onConnectionComplete,
    );
    this.socket.on(MessageTypeS2C.GO_QUEUE, this.onPleaseEnterQueue);
    this.socket.on(MessageTypeS2C.QUEUE_STATE, this.onQueueState);
    this.socket.on(MessageTypeS2C.PLAYER_QUEUE_STATE, this.onPlayerQueueState);
    this.socket.on(MessageTypeS2C.PLAYER_ROOM_STATE, this.onPlayerRoomState);
    this.socket.on(MessageTypeS2C.PLAYER_ROOM_FOUND, this.onPlayerRoomFound);
    this.socket.on(MessageTypeS2C.PLAYER_PARTY_STATE, this.onPlayerPartyState);
    this.socket.on(MessageTypeS2C.PLAYER_GAME_STATE, this.onPlayerGameState);
    this.socket.on(MessageTypeS2C.PLAYER_GAME_READY, this.onPlayerGameReady);
    this.socket.on(
      MessageTypeS2C.PLAYER_SERVER_SEARCHING,
      this.onPlayerServerSearching,
    );
    this.socket.on(MessageTypeS2C.ONLINE_UPDATE, this.onOnlineUpdate);

    this.socket.on(
      MessageTypeS2C.PLAYER_PARTY_INVITES_STATE,
      this.onPlayerPartyInvitations,
    );
    this.socket.on(
      MessageTypeS2C.PARTY_INVITE_RECEIVED,
      this.onPartyInviteReceived,
    );
    this.socket.on(
      MessageTypeS2C.PARTY_INVITE_EXPIRED,
      this.onPartyInviteExpired,
    );
  }

  hydrate(p: QueueStoreHydrateProps): void {
    runInAction(() => {
      this.party = p.party;
      this.selectedModes = p.defaultModes;
    });
  }

  @action
  public onConnected = () => {
    if (this.readyState === GameCoordinatorState.DISCONNECTED) {
      console.log("Set state -> Connected");
      this.readyState = GameCoordinatorState.CONNECTED;
    }
  };

  @action
  public onDisconnected = () => {
    console.log("Set state -> Disconnected");
    this.readyState = GameCoordinatorState.DISCONNECTED;
    this.cleanUp();
  };

  public inQueueCount(mode: MatchmakingMode, version: Dota2Version): number {
    return this.inQueue[JSON.stringify({ mode: mode, version: version })];
  }

  public inGameCount(mode: MatchmakingMode): number {
    const od = this.onlineData;
    if (!od) return 0;
    return od.perMode.find((t) => t.lobbyType === mode)?.playerCount || 0;
  }

  @action
  public toggleMode = (mode: MatchmakingMode) => {
    const enabled = this.selectedModes.includes(mode);
    if (enabled) {
      this.selectedModes = this.selectedModes.filter((m) => m !== mode);
    } else {
      this.selectedModes = [...this.selectedModes, mode];
    }
  };

  @action
  public setSelectedMode = (mode: MatchmakingMode, enabled: boolean) => {
    if (enabled) {
      this.selectedModes = this.selectedModes.includes(mode)
        ? this.selectedModes
        : [...this.selectedModes, mode];
    } else {
      this.selectedModes = this.selectedModes.filter((m) => m !== mode);
    }

    if (typeof window !== "undefined") {
      BrowserCookies.set(
        "d2c_selectedMode",
        btoa(JSON.stringify(this.selectedModes)),
        {
          path: "/",
          expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 10000,
        },
      );
    }
  };

  // Actions

  private playGameFoundSound() {
    this.matchSound.play();
    blinkTab(document.title, "Игра найдена!");
  }

  private playMatchStartedSound() {
    this.roomReadySound.play();
  }

  private acceptParty(id: string) {
    this.submitPartyInvite(id, true);
    this.notify.dequeue(id);
  }

  private declineParty(id: string) {
    this.submitPartyInvite(id, false);
    this.notify.dequeue(id);
  }

  /**
   * Private utility
   */
  private canQueue() {
    return this.ready;
  }

  @action
  private cleanUp() {
    this.queueState = undefined;
    this.inQueue = DefaultQueueHolder;
  }

  @action
  private async fetchParty() {
    getApi()
      .playerApi.playerControllerMyParty()
      .then((data) => {
        console.log("FetchParty -> ", data);
        runInAction(() => (this.party = data));
      })
      .catch(() => (this.party = undefined));
  }

  public static inferDefaultMode(
    getCookie: (key: string) => string | null,
    party: PartyDto | undefined,
  ): MatchmakingMode[] {
    const cookieValue = getCookie("d2c_selectedMode");
    if (cookieValue) {
      try {
        return JSON.parse(atob(cookieValue));
      } catch (e) {
        console.warn(e);
      }
    }

    if (party) {
      const accessLevel = getPartyAccessLevel(party);
      if (accessLevel == GameModeAccessLevel.EDUCATION)
        return [MatchmakingMode.BOTS];
      else if (accessLevel === GameModeAccessLevel.SIMPLE_MODES)
        return [MatchmakingMode.BOTS2X2, MatchmakingMode.SOLOMID];
      else return [MatchmakingMode.UNRANKED];
    } else {
      return [MatchmakingMode.BOTS];
    }
  }

  @action onOnlineUpdate = (msg: OnlineUpdateMessageS2C) => {
    this.online = msg.online;
  };

  @action onPartyInviteExpired = (msg: PartyInviteExpiredMessageS2C) => {
    this.notify.dequeue(msg.inviteId);
  };

  @action onPartyInviteReceived = (msg: PartyInviteReceivedMessageS2C) => {
    const dto = new NotificationDto(
      (
        <PartyInviteNotification
          inviter={msg.inviter.name}
          onDecline={() => this.declineParty(msg.inviteId)}
          onAccept={() => this.acceptParty(msg.inviteId)}
        />
      ),
      msg.inviteId,
    );
    this.notify.enqueueNotification(dto);
    this.partyInviteReceivedSound.play();
  };

  @action onPlayerGameState = (msg: PlayerGameStateMessageS2C | undefined) => {
    this.gameState = msg;
    this.serverSearching = false;
    if (msg) {
      this.roomState = undefined;
      this.queueState = undefined;
    }
  };

  @action onPlayerGameReady = (msg: PlayerGameStateMessageS2C) => {
    this.onPlayerGameState(msg);
    this.playMatchStartedSound();
  };

  @action onPlayerPartyInvitations = (
    msg: PlayerPartyInvitationsMessageS2C,
  ) => {
    msg.invitations.forEach((invitation) =>
      this.onPartyInviteReceived(invitation),
    );
  };

  @action onPlayerQueueState = (
    msg: PlayerQueueStateMessageS2C | undefined,
  ) => {
    this.queueState = msg;
    this.serverSearching = false;
  };

  @action onPlayerRoomState = (msg: PlayerRoomStateMessageS2C | undefined) => {
    this.roomState = msg;
    // this.roomState = new PlayerRoomStateMessageS2C("sdfsf",
    //   MatchmakingMode.BOTS,
    //   new Array(10)
    //     .fill(null)
    //     .map((t, index) => new PlayerRoomEntry(index === 0 ? '116514945' : "1350458795", index % 2 === 1 ? ReadyState.PENDING : ReadyState.READY))
    // );
    this.serverSearching = false;
  };

  @action onPlayerRoomFound = (msg: PlayerRoomStateMessageS2C) => {
    this.onPlayerRoomState(msg);
    this.playGameFoundSound();
  };

  @action onQueueState = (msg: QueueStateMessageS2C) => {
    this.inQueue[JSON.stringify({ mode: msg.mode, version: msg.version })] =
      msg.inQueue;
  };

  @action onPlayerPartyState = (msg: PartyDto) => {
    console.log("Update party via socket", msg);
    this.party = msg;
  };

  @action onPlayerServerSearching = (msg: PlayerServerSearchingMessageS2C) => {
    this.serverSearching = msg.searching;
  };

  @action onConnectionComplete = () => {
    this.readyState = GameCoordinatorState.CONNECTION_COMPLETE;
  };

  onPleaseEnterQueue = (msg: PleaseEnterQueueMessageS2C) => {
    this.notify.enqueueNotification(
      new NotificationDto(
        <PleaseQueueNotification inQueue={msg.inQueue} mode={msg.mode} />,
        undefined,
      ),
    );
    this.partyInviteReceivedSound.play();
  };
}
