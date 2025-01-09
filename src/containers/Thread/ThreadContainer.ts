import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  trace,
} from "mobx";
import {
  SortOrder,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
  ThreadType,
} from "@/api/back";
import { maxBy } from "@/util";
import { getApi } from "@/api/hooks";
import { GroupedMessages, ThreadView } from "@/containers/Thread/threads";

export class ThreadContainer {
  @observable.ref
  private id: string = "";

  @observable.ref
  private threadType: ThreadType = ThreadType.FORUM;

  @observable
  messageMap: Map<string, ThreadMessageDTO> = new Map();

  @observable
  pg: ThreadMessagePageDTO | undefined = undefined;

  @observable
  page: number | undefined = undefined;

  @observable
  thread: ThreadDTO | undefined = undefined;

  @computed
  public get isThreadReady() {
    // We are ready if thread is not undefined and we did try load messages
    return !!this.thread && !!this.pg;
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
    const pool = this.relevantMessages.toSorted(
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
        !!msg.reply;
      pool2.push([msg, header]);
    }
    return pool2;
  }

  @computed
  public get threadView(): ThreadView {
    const messagePool = this.relevantMessages.toSorted(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const groupedMessages: GroupedMessages[] = [];

    const messages = [...messagePool];

    let group: GroupedMessages | undefined = undefined;

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (
        !group ||
        group.author.steamId !== msg.author.steamId ||
        msg.reply !== undefined
      ) {
        group = {
          author: msg.author,
          displayDate: msg.createdAt,
          messages: [msg],
        };
        groupedMessages.push(group);
      } else if (group.author.steamId === msg.author.steamId) {
        group.messages.push(msg);
      }
    }

    return {
      id: this.id,
      type: this.threadType,
      groupedMessages: groupedMessages,
    } satisfies ThreadView;
  }

  constructor(
    id: string,
    threadType: ThreadType,
    init: ThreadMessageDTO[] | ThreadMessagePageDTO | undefined,
    page: number | undefined,
  ) {
    makeObservable(this);
    this.threadType = threadType;
    this.id = id;
    this.page = page;
    this.initialLoad().then(() => this.fetchThread(id, threadType));

    if (init) {
      if ("page" in init) {
        // start with page and messages for good measure
        this.pg = init;
        this.messageMap = new Map(init.data.map((it) => [it.messageId, it]));
      } else {
        // just messages
        this.messageMap = new Map(init.map((it) => [it.messageId, it]));
      }
    }

    trace(this, "threadView");
    trace(this, "relevantMessages");
    trace(this, "thread");
  }

  private initialLoad = async () => {
    if (this.page !== undefined) {
      this.loadPage(this.page);
    } else {
      getApi()
        .forumApi.forumControllerGetLatestPage(this.id, this.threadType, 200)
        .then(this.setPageData);
    }
  };

  consumeMessage = (msg: ThreadMessageDTO) => this.consumeMessages([msg]);

  @action consumeMessages = (msgs: ThreadMessageDTO[]) => {
    // kinda upsert
    msgs.forEach((message) => {
      const existing = this.messageMap.get(message.messageId);
      if (!existing || existing.updatedAt !== message.updatedAt) {
        this.messageMap.set(message.messageId, message);
      }
    });
    // Here we have a tricky part and don't like it
    if (msgs.length === 1 && this.pg && this.pg.data.length > 0) {
      const msg = msgs[0];
      // if we only consume a single message, aka "send message" or receive update via socket
      // if we know its later than our known last and fits into perPage size
      if (
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

  @action loadPage = (page: number) => {
    getApi()
      .forumApi.forumControllerMessagesPage(
        this.id.toString(),
        this.threadType,
        page,
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
        threadId: this.id,
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
}
