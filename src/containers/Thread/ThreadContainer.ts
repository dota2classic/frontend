import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
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
  @observable
  messageMap: Map<string, ThreadMessageDTO> = new Map();

  @observable
  pg: ThreadMessagePageDTO | undefined = undefined;

  @observable
  page: number | undefined = undefined;

  @observable
  thread: ThreadDTO | undefined = undefined;

  @computed
  public get relevantMessages(): ThreadMessageDTO[] {
    return (
      this.pg ? this.pg.data : Array.from(this.messageMap.values())
    ).filter((t) => !t.deleted);
  }

  @computed
  public get threadView(): ThreadView {
    const messagePool = this.relevantMessages.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const groupedMessages: GroupedMessages[] = [];

    const messages = [...messagePool];

    let group: GroupedMessages | undefined = undefined;
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!group || group.author.steamId !== msg.author.steamId) {
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
    public id: string,
    public threadType: ThreadType,
    init: ThreadMessageDTO[] | ThreadMessagePageDTO | undefined,
    page: number | undefined,
  ) {
    makeObservable(this);
    this.page = page;
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
    this.fetchThread();
  }

  consumeMessage = (msg: ThreadMessageDTO) => this.consumeMessages([msg]);

  @action consumeMessages = (msgs: ThreadMessageDTO[]) => {
    msgs.forEach((message) => this.messageMap.set(message.messageId, message));
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

    this.fetchThread();
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

  private fetchThread = async () => {
    getApi()
      .forumApi.forumControllerGetThread(this.id, this.threadType)
      .then((thread) => runInAction(() => (this.thread = thread)))
      .catch();
  };
}
