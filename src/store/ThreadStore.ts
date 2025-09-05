import { HydratableStore } from "@/store/HydratableStore";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  trace,
} from "mobx";
import { ThreadType } from "@/api/mapped-models";
import {
  SortOrder,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
} from "@/api/back";
import { diffMillis } from "@/util/dates";
import { getApi } from "@/api/hooks";
import { maxBy } from "@/util/maxBy";
import { VirtuosoHandle } from "react-virtuoso";

export class ThreadStore implements HydratableStore<unknown> {
  @observable
  replyingMessageId: string | undefined = undefined;

  @observable
  editingMessageId: string | undefined = undefined;

  @observable.ref
  chatScrollRef: VirtuosoHandle | undefined = undefined;

  @observable.ref
  id: string = "";

  @observable.ref
  threadType: ThreadType = ThreadType.FORUM;

  @observable
  messageMap: Map<string, ThreadMessageDTO> = new Map();

  @observable
  pg: ThreadMessagePageDTO | undefined = undefined;

  @observable
  page: number | undefined = undefined;

  @observable
  thread: ThreadDTO | undefined = undefined;

  @computed
  public get replyingMessage(): ThreadMessageDTO | undefined {
    return (
      (this.replyingMessageId && this.messageMap.get(this.replyingMessageId)) ||
      undefined
    );
  }

  public scrollIntoView = (messageId: string) => {
    const msg = this.messageMap.get(messageId);
    if (!msg || msg.deleted) return;

    const idx = this.pool.findIndex((d) => d[0].messageId === messageId);
    if (this.chatScrollRef) {
      this.chatScrollRef.scrollToIndex(idx);
    }
  };

  @action setScrollRef = (e: VirtuosoHandle | undefined) => {
    this.chatScrollRef = e;
  };

  @action setReplyMessageId = (messageId: string | undefined) => {
    this.replyingMessageId = messageId;
  };

  @action setEditMessage = (editingMessageId: string | undefined) => {
    this.editingMessageId = editingMessageId;
  };

  @computed
  public get isThreadReady() {
    // We are ready if thread is not undefined and we did try load messages
    return !!this.thread && (this.messageMap.size || !!this.pg);
  }

  @computed
  public get relevantMessages(): ThreadMessageDTO[] {
    // return this.pg ? this.pg.data : Array.from(this.messageMap.values());
    return this.page !== undefined
      ? this.pg?.data || []
      : Array.from(this.messageMap.values());
  }

  @computed
  public get pool(): [ThreadMessageDTO, boolean][] {
    const pool = this.relevantMessages
      .filter((t) => !t.deleted)
      .toSorted(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const pool2: [ThreadMessageDTO, boolean][] = [];
    for (let i = 0; i < pool.length; i++) {
      const msg = pool[i];
      const previousMessage = pool[i - 1];
      const header =
        !previousMessage ||
        previousMessage.author.steamId !== msg.author.steamId ||
        !!msg.reply ||
        Math.abs(diffMillis(msg.createdAt, previousMessage.createdAt)) >
          1000 * 60;
      pool2.push([msg, header]);
    }

    return pool2;
  }

  constructor(
    id: string,
    threadType: ThreadType,
    loadLatestPage: "page" | "fast",
    init: ThreadMessageDTO[] | ThreadMessagePageDTO | undefined,
    page: number | undefined,
  ) {
    makeObservable(this);
    this.threadType = threadType;
    this.id = id;
    this.page = page;

    if (init) {
      this.setInitial(init);
      this.fetchThread(id, threadType).then();
    } else {
      this.initialLoad().then(() => this.fetchThread(id, threadType));
    }

    trace(this, "relevantMessages");
    trace(this, "thread");
  }

  private initialLoad = async () => {
    if (this.page !== undefined) {
      this.loadPage(this.page);
    } else {
      getApi()
        .forumApi.forumControllerGetMessages(
          this.id,
          this.threadType,
          undefined,
          100,
          SortOrder.DESC,
        )
        .then(this.consumeMessages);
      // getApi()
      //   .forumApi.forumControllerGetLatestPage(this.id, this.threadType, 100)
      //   .then(this.setPageData);
    }
  };

  consumeMessage = (msg: ThreadMessageDTO) => this.consumeMessages([msg]);

  @action consumeMessages = (msgs: ThreadMessageDTO[]) => {
    // kinda upsert
    msgs.forEach((message) => {
      const existing = this.messageMap.get(message.messageId);
      if (
        !existing ||
        existing.updatedAt !== message.updatedAt ||
        message.deleted !== existing.deleted
      ) {
        this.messageMap.set(message.messageId, message);
      }
    });
    // Here we have a tricky part and don't like it
    if (msgs.length === 1 && this.pg) {
      const msg = msgs[0];
      // if we only consume a single message, aka "send message" or receive update via socket
      // if we know its later than our known last and fits into perPage size
      if (
        this.pg.data.length === 0 ||
        new Date(msg.createdAt).getTime() >
          new Date(this.pg.data[this.pg.data.length - 1].createdAt).getTime()
      ) {
        // we can append it
        if (this.pg.data.length < this.pg.perPage) {
          this.pg.data.push(msg);
        } else if (this.pg.pages === 1 || this.pg.page === this.pg.pages - 1) {
          // otherwise we know its next page
          this.pg.pages += 1;
        }
      } else {
        // Message updated or deleted
        const idx = this.pg.data.findIndex(
          (t) => t.messageId === msg.messageId,
        );
        if (idx !== -1) this.pg.data[idx] = msg;
      }
    }
  };

  @action setPageData = (pg: ThreadMessagePageDTO) => {
    this.pg = pg;
    this.consumeMessages(pg.data);
  };

  loadMore = async (loadLatest: boolean, loadCount: number = 10) => {
    const cursor = loadLatest
      ? maxBy(this.relevantMessages, (it) => new Date(it.createdAt).getTime())
          ?.createdAt
      : maxBy(this.relevantMessages, (it) => -new Date(it.createdAt).getTime())
          ?.createdAt;

    getApi()
      .forumApi.forumControllerGetMessages(
        this.id.toString(),
        this.threadType,
        cursor,
        loadCount,
        loadLatest
          ? cursor === undefined
            ? SortOrder.DESC
            : SortOrder.ASC
          : SortOrder.DESC,
      )
      .then(this.consumeMessages);
  };

  @action loadPage = (page: number, perPage?: number) => {
    getApi()
      .forumApi.forumControllerMessagesPage(
        this.id.toString(),
        this.threadType,
        page,
        undefined,
        perPage,
      )
      .then(this.setPageData);
  };

  @action updateThread = (threadType: ThreadType, id: string) => {
    const threadChanged = threadType !== this.threadType || id !== this.id;
    if (!threadChanged) return;

    this.threadType = threadType;
    this.id = id;
    this.pg = undefined;
    this.page = 0;
    this.messageMap.clear();

    this.fetchThread(id, threadType).then();
  };

  loadOlder = () => this.loadMore(false, 100);
  loadNewer = () => this.loadMore(true, 100);

  public react = async (messageId: string, id: number) => {
    getApi()
      .forumApi.forumControllerReact(messageId, {
        emoticonId: id,
      })
      .then((msg) => this.consumeMessages([msg]));
  };

  public deleteMessage = async (messageId: string) => {
    getApi()
      .forumApi.forumControllerDeleteMessage(messageId)
      .then(this.consumeMessage);
  };

  private fetchThread = async (id: string, threadType: ThreadType) => {
    return getApi()
      .forumApi.forumControllerGetThread(id, threadType)
      .then((thread) => runInAction(() => (this.thread = thread)))
      .catch();
  };

  public async sendMessage(msg: string, replyingMessageId: string | undefined) {
    return getApi()
      .forumApi.forumControllerPostMessage({
        threadId: `${this.threadType}_${this.id}`,
        content: msg,
        replyMessageId: replyingMessageId,
      })
      .then(this.consumeMessage);
  }

  public async editMessage(id: string, content: string) {
    return getApi()
      .forumApi.forumControllerEditMessage(id, { content })
      .then(this.consumeMessage);
  }

  hydrate(): void {}

  @action
  setInitial(init: ThreadMessageDTO[] | ThreadMessagePageDTO) {
    if ("page" in init) {
      // start with page and messages for good measure
      this.pg = init;
      this.messageMap = new Map(init.data.map((it) => [it.messageId, it]));
    } else {
      // just messages
      this.messageMap = new Map(init.map((it) => [it.messageId, it]));
    }
  }

  @action
  setBlockMessagesOf(relatedSteamId: string, block: boolean) {
    this.messageMap.values().forEach((msg) => {
      if (msg.author.steamId === relatedSteamId) {
        this.messageMap.set(msg.messageId, {
          ...msg,
          blocked: block,
        });
      }
    });
  }
}
