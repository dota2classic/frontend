import { HydratableStore } from "@/store/HydratableStore";
import {
  GameFound,
  isInQueue,
  LauncherServerStarted,
  Messages,
  PartyInviteReceivedMessage,
  QueueStateMessage,
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
import { AppApi, getApi } from "@/api/hooks";
import { GameCoordinatorListener } from "@/store/queue/game-coordinator.listener";
import { AuthStore } from "@/store/AuthStore";
import { Dota2Version, MatchmakingMode } from "@/api/mapped-models";
import { BanStatusDto, PartyDto, PartyMemberDTO } from "@/api/back";
import { GameCoordinatorState } from "@/store/queue/game-coordinator.state";
import { DefaultQueueHolder } from "@/store/queue/mock";
import { Howl } from "howler";
import { Sounds } from "@/const/sounds";
import { blinkTab } from "@/util/blinkTab";
import { NotificationDto, NotificationStore } from "@/store/NotificationStore";
import { PartyInviteNotification } from "@/components";
import { isNewbieParty } from "@/util/party";

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

interface QueueStoreHydrateProps {
  party?: PartyDto;
}

export class QueueStore
  implements HydratableStore<QueueStoreHydrateProps>, GameCoordinatorListener
{
  @observable
  public pendingPartyInvite?: PartyInviteReceivedMessage = undefined;
  @observable
  public searchingMode: QueueState | undefined = undefined;
  @observable
  public selectedMode: QueueState | undefined = undefined;
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

  @observable
  public online: string[] = [];

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

    this.matchSound = new Howl({
      src: Sounds.MATCH_GAME,
    });
    this.roomReadySound = new Howl({
      src: Sounds.NOTIFY_GAME,
    });

    this.partyInviteReceivedSound = new Howl({
      src: Sounds.PARTY_INVITE,
      volume: 0.4,
    });
    this.connect();

    this.periodicallyFetchParty();
  }

  private periodicallyFetchParty() {
    this.fetchParty().finally();
    setInterval(() => {
      this.fetchParty().finally();
    }, 5000);
  }

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
  public get isNewbieParty(): boolean {
    return this.party ? isNewbieParty(this.party) : true;
  }

  @computed
  public get selectedModeBanned(): boolean {
    if (this.selectedMode?.mode === MatchmakingMode.BOTS) return false;
    return this.partyBanStatus?.isBanned || false;
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
    if (!this.selectedMode) return;
    try {
      if (this.canQueue()) {
        this.startSearch(this.selectedMode);
        return true;
      } else {
        return false;
      }
    } catch (e: unknown) {
      console.warn(e);
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

  public async connect() {
    if (this.socket && this.socket.connected) return;

    // Make sure token is not stale
    await this.authStore.fetchMe();

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
    this.socket.on(Messages.ONLINE_UPDATE, this.onOnlineUpdate);
  }

  hydrate(p: QueueStoreHydrateProps): void {
    runInAction(() => {
      this.party = p.party;
      this.selectedMode = QueueStore.inferDefaultMode(p.party);
      console.log(`Hydrated party`, this.party);
    });
  }

  @action
  onAuthResponse = ({ success }: { success: boolean }) => {
    if (success) {
      this.onAuthorized();
    }
  };

  @action onAuthorized = (): void => {
    console.log("Set state -> Authorized");
    this.readyState = GameCoordinatorState.AUTHORIZED;
  };

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

  @action onOnlineUpdate = ({ online }: { online: string[] }): void => {
    this.online = online;
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

  @action onQueueState = (e: QueueStateMessage): void => {
    if (isInQueue(e)) {
      const { mode, version } = e;
      const qs = { mode, version } satisfies QueueState;
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
        mode: data.info.mode,
        accepted: 0,
        total: 0,
        roomID: data.info.roomId,
        iAccepted: true,
      };
    }
    this.gameInfo.serverURL = data.url;
    this.searchingMode = undefined
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
      this.selectedMode?.mode === MatchmakingMode.CAPTAINS_MODE &&
      this.party!.players.length !== 5
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
    getApi()
      .playerApi.playerControllerMyParty()
      .then((data) => runInAction(() => (this.party = data)))
      .catch(() => (this.party = undefined));
  }

  private static inferDefaultMode(party: PartyDto | undefined): QueueState {
    if (party) {
      return isNewbieParty(party)
        ? {
            mode: MatchmakingMode.BOTS,
            version: Dota2Version.Dota_684,
          }
        : {
            mode: MatchmakingMode.UNRANKED,
            version: Dota2Version.Dota_684,
          };
    } else {
      return {
        mode: MatchmakingMode.BOTS,
        version: Dota2Version.Dota_684,
      };
    }
  }
}
