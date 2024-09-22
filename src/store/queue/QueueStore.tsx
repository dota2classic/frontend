import { HydratableStore } from "@/store/HydratableStore";
import {
  GameFound,
  LauncherServerStarted,
  Messages,
  PartyInviteReceivedMessage,
  ReadyCheckUpdate,
  RoomState,
} from "@/util/messages";
import { io, Socket } from "socket.io-client";
import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
} from "mobx";
import { AppApi, useApi } from "@/api/hooks";
import { GameCoordinatorListener } from "@/store/queue/game-coordinator.listener";
import { AuthStore } from "@/store/AuthStore";
import { MatchmakingMode } from "@/const/enums";
import { Dota2Version } from "@/util/gamemode";
import { PartyDto } from "@/api/back";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { DefaultQueueHolder } from "@/store/queue/mock";
import { Howl } from "howler";
import { Sounds } from "@/const/sounds";
import { blinkTab } from "@/util/blinkTab";
import { NotificationDto, NotificationStore } from "@/store/NotificationStore";
import { PartyInviteNotification } from "@/components";

interface HydrationData {}

export interface QueueState {
  mode: MatchmakingMode;
  version: Dota2Version;
}

export type QueueHolder = {
  [key: string]: number;
};

export interface GameInfo {
  mode: MatchmakingMode;
  accepted: number;
  total: number;
  roomID: string;
  iAccepted: boolean;
  serverURL?: string;
}

export class QueueStore
  implements HydratableStore<HydrationData>, GameCoordinatorListener
{
  @observable
  public pendingPartyInvite?: PartyInviteReceivedMessage = undefined;
  @observable
  public searchingMode: QueueState | undefined = undefined;
  @observable
  public selectedMode: QueueState = {
    mode: MatchmakingMode.SOLOMID,
    version: Dota2Version.Dota_684,
  };
  @observable
  public readyState: GameCoordinatorState = GameCoordinatorState.DISCONNECTED;
  @observable
  public inQueue: QueueHolder = DefaultQueueHolder;
  @observable
  public gameInfo: GameInfo | undefined = undefined;
  @observable
  public party: PartyDto | undefined = undefined;
  @observable
  public connected: boolean = false;
  @observable
  public authorized: boolean = false;

  private matchSound!: Howl;
  private roomReadySound!: Howl;
  private partyInviteReceivedSound!: Howl;

  private socket!: Socket;

  constructor(
    private readonly authStore: AuthStore,
    private readonly notify: NotificationStore,
    private readonly api: AppApi,
  ) {
    makeAutoObservable(this);

    if (typeof window === "undefined") return;

    this.fetchParty().finally();

    this.matchSound = new Howl({
      src: Sounds.MATCH_GAME,
    });
    this.roomReadySound = new Howl({
      src: Sounds.NOTIFY_GAME,
    });

    this.partyInviteReceivedSound = new Howl({
      src: Sounds.PARTY_INVITE,
    });
    this.connect();
  }

  @computed
  public get selectedModeBanned(): boolean {
    if (this.selectedMode.mode === MatchmakingMode.BOTS) return false;
    return !!this.authStore.me?.banStatus.isBanned;
  }

  @computed
  public get needAuth(): boolean {
    return !this.authStore.isAuthorized;
  }

  @computed
  public get ready(): boolean {
    return (
      this.readyState === GameCoordinatorState.AUTHORIZED &&
      this.party !== undefined &&
      !this.needAuth
    );
  }

  @computed
  public get isSearchingServer(): boolean {
    if (!this.gameInfo) return false;
    return (
      this.gameInfo.accepted === this.gameInfo.total && !this.gameInfo.serverURL
    );
  }

  @action
  public cancelSearch() {
    this.searchingMode = undefined;
    this.socket.emit(Messages.LEAVE_ALL_QUEUES);
  }

  @action
  public startSearch = (qs: QueueState) => {
    this.searchingMode = qs;
    this.socket.emit(Messages.ENTER_QUEUE, qs);
  };

  @action
  public acceptGame = () => {
    this.acceptPendingGame(this.gameInfo?.roomID);
    if (this.gameInfo) this.gameInfo.iAccepted = true;
  };

  @action
  public declineGame = () => {
    this.declinePendingGame(this.gameInfo?.roomID);
    this.gameInfo = undefined;
    this.cancelSearch();
  };

  // @action
  public enterQueue(): boolean {
    try {
      if (this.canQueue()) {
        this.startSearch(this.selectedMode);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return true;
    }
  }

  public acceptPendingGame = (roomId?: string) => {
    this.socket.emit(Messages.SET_READY_CHECK, {
      roomID: roomId,
      accept: true,
    });
  };

  public declinePendingGame = (roomId?: string) => {
    this.socket.emit(Messages.SET_READY_CHECK, {
      roomID: roomId,
      accept: false,
    });
  };

  @action
  public inviteToParty = (id: string) => {
    this.socket.emit(Messages.INVITE_TO_PARTY, {
      id,
    });
  };

  public submitPartyInvite = (id: string, accept: boolean) => {
    this.socket.emit(Messages.ACCEPT_PARTY_INVITE, {
      accept,
      id,
    });
  };

  public leaveParty = () => {
    this.socket.emit(Messages.LEAVE_PARTY);
  };

  disconnect() {
    this.socket.disconnect();
  }

  public connect() {
    if (this.socket && this.socket.connected) return;

    if (!this.authStore.parsedToken) {
      console.warn("Trying to connect while unauthorized");
      return;
    }

    this.socket = io("wss://dotaclassic.ru", {
      // this.socket = io("ws://localhost:5010", {
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token: this.authStore.token,
      },
    });

    this.socket.on("connect", () => {
      this.onConnected();
    });

    this.socket.connect();

    // @ts-ignore
    // observe<AuthStore>(
    //   this.authStore,
    //   "parsedToken",
    //   (change: IValueDidChange) => {
    //     console.log(
    //       "Authorize cause steamID observe",
    //       change.oldValue,
    //       change.newValue,
    //     );
    //   },
    //   true,
    // );

    this.socket.on("disconnect", () => {
      this.onDisconnected();
      this.connected = false;
      this.authorized = false;
    });

    this.socket.on(Messages.QUEUE_UPDATE, this.onQueueUpdate);
    this.socket.on(Messages.AUTH, this.onAuthResponse);
    this.socket.on(Messages.GAME_FOUND, this.onGameFound);
    this.socket.on(Messages.READY_CHECK_UPDATE, this.onReadyCheckUpdate);
    this.socket.on(Messages.SERVER_STARTED, this.onServerReady);
    this.socket.on(Messages.ROOM_STATE, this.onRoomState);
    this.socket.on(Messages.ROOM_NOT_READY, this.onRoomNotReady);
    this.socket.on(Messages.QUEUE_STATE, this.onQueueState);
    this.socket.on(Messages.MATCH_FINISHED, this.onMatchFinished);
    this.socket.on(Messages.MATCH_STATE, this.onMatchState);
    this.socket.on(Messages.MATCH_RESULTS_READY, this.onMatchFinished);
    this.socket.on(Messages.PARTY_INVITE_RECEIVED, this.onPartyInviteReceived);
    this.socket.on(Messages.PARTY_INVITE_EXPIRED, this.onPartyInviteExpired);
    this.socket.on(Messages.PARTY_UPDATED, this.onPartyUpdated);
    this.socket.on(Messages.BAD_AUTH, this.badAuth);
  }

  hydrate(d: HydrationData): void {}

  @action
  onAuthResponse = ({ success }: { success: boolean }) => {
    if (success) {
      this.onAuthorized();
    }
  };

  @action onAuthorized = (): void => {
    this.readyState = GameCoordinatorState.AUTHORIZED;
  };

  @action
  public onConnected = () => {
    this.readyState = GameCoordinatorState.CONNECTED;
  };

  @action
  public onDisconnected = () => {
    this.readyState = GameCoordinatorState.DISCONNECTED;
    this.cleanUp();
  };

  @action onGameFound = (gf: GameFound): void => {
    this.gameInfo = {
      mode: gf.mode,
      accepted: gf.accepted,
      total: gf.total,
      roomID: gf.roomID,
      iAccepted: false,
    };
    this.playGameFoundSound();
    blinkTab("Поиск игры - dota2classic.ru", "Игра найдена!");
  };

  @action onMatchFinished = (): void => {
    this.gameInfo = undefined;
  };

  @action onMatchState = (url?: string): void => {
    if (!url && this.gameInfo) {
      this.gameInfo.serverURL = undefined;
      return;
    } else if (!url && !this.gameInfo) return;

    if (!this.gameInfo) {
      this.gameInfo = {
        mode: MatchmakingMode.BOTS,
        accepted: 0,
        total: 0,
        roomID: "",
        iAccepted: true,
      };
    }
    this.gameInfo.serverURL = url;
  };

  @action onPartyInviteExpired = (id: string): void => {
    this.notify.dequeue(id);
  };

  @action onPartyInviteReceived = (t: PartyInviteReceivedMessage): void => {
    const dto = new NotificationDto(
      (
        <PartyInviteNotification
          inviter={t.leader}
          onDecline={() => this.declineParty(t.inviteId)}
          onAccept={() => this.acceptParty(t.inviteId)}
        />
      ),
      t.inviteId,
    );
    this.notify.enqueueNotification(dto);
    this.partyInviteReceivedSound.play();
  };

  @action onPartyUpdated = (): void => {
    this.fetchParty().finally();
  };

  @action onQueueState = (
    e: {
      mode?: MatchmakingMode;
      version?: Dota2Version;
    } | null,
  ): void => {
    if (!e) return;
    const { mode, version } = e;
    if (mode != null && version != null) {
      const qs: QueueState = { mode, version };
      this.searchingMode = qs;
      this.selectedMode = qs;
    } else {
      this.searchingMode = undefined;
    }
  };

  @action onReadyCheckUpdate = (data: ReadyCheckUpdate): void => {
    if (!this.gameInfo) return;
    this.gameInfo.accepted = data.accepted;
    this.gameInfo.total = data.total;
    this.gameInfo.mode = data.mode;
  };

  @action onRoomNotReady = (): void => {
    this.gameInfo = undefined;
  };

  @action onRoomState = (state?: RoomState): void => {
    if (!state) {
      this.gameInfo = undefined;
    } else {
      this.searchingMode = undefined;

      if (!this.gameInfo)
        this.gameInfo = {
          mode: state.mode,
          accepted: state.accepted,
          total: state.total,
          roomID: state.roomId,
          iAccepted: state.iAccepted,
        };
      else
        this.gameInfo = {
          ...this.gameInfo,
          mode: state.mode,
          accepted: state.accepted,
          total: state.total,
          roomID: state.roomId,
          iAccepted: state.iAccepted,
        };
    }
  };

  @action onServerReady = (data: LauncherServerStarted) => {
    if (!this.gameInfo) {
      this.gameInfo = {
        mode: data.info.mode as any,
        accepted: 0,
        total: 0,
        roomID: data.info.roomId,
        iAccepted: true,
      };
    }
    this.gameInfo.serverURL = data.url;
    this.roomReadySound.play();
  };

  @action
  onQueueUpdate = ({
    mode,
    version,
    inQueue,
  }: {
    mode: MatchmakingMode;
    version: Dota2Version;
    inQueue: number;
  }) => {
    this.inQueue[JSON.stringify({ mode, version })] = inQueue;
  };

  public inQueueCount(mode: MatchmakingMode, version: Dota2Version): number {
    return this.inQueue[JSON.stringify({ mode: mode, version: version })];
  }

  @action
  public setSelectedMode = (mode: MatchmakingMode, version: Dota2Version) => {
    this.selectedMode = {
      mode,
      version,
    };
  };

  // Actions

  private authorize() {
    this.socket.emit(Messages.BROWSER_AUTH, {
      token: this.authStore.token,
      recaptchaToken: "",
    });
  }

  private badAuth = () => {
    console.log("Prevent logging out");
    // this.authStore.logout();
  };

  private playGameFoundSound() {
    this.matchSound.play();
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
    if (!this.ready) throw new Error("Not ready");
    if (
      this.selectedMode.mode === MatchmakingMode.CAPTAINS_MODE &&
      this.party!!.players.length !== 5
    ) {
      return false;
    }

    // if (this.selectedMode.mode === MatchmakingMode.RANKED && this.party!!.players.length > 1) {
    //   // dont allow parties in ranked
    //   return false;
    // }

    return true;
  }

  @action
  private cleanUp() {
    this.searchingMode = undefined;
    this.inQueue = DefaultQueueHolder;
  }

  @action
  private async fetchParty() {
    useApi()
      .playerApi.playerControllerMyParty()
      .then((data) => runInAction(() => (this.party = data)))
      .catch((e) => (this.party = undefined));
  }
}
