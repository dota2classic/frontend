import { getApi } from "@/api/hooks";
import { useCallback, useEffect, useState } from "react";
import {
  querystring,
  SortOrder,
  ThreadDTO,
  ThreadMessageDTO,
  ThreadMessagePageDTO,
  UserDTO,
} from "@/api/back";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { maxBy } from "@/util/iter";
import { useLocalObservable } from "mobx-react-lite";
import { action, computed, makeObservable, observable } from "mobx";

export interface Thread {
  id: string;
  type: ThreadType;
  messages: ThreadMessageDTO[];
}

const useThreadEventSource = (
  id: string,
  threadType: ThreadType,
  consumeMessages: (messages: ThreadMessageDTO[]) => void,
  trigger: number = 0,
) => {
  const bp = getApi().apiParams.basePath;
  const endpoint = getApi().forumApi.forumControllerThreadContext({
    id: id.toString(),
    threadType: threadType,
  });

  const context = JSON.stringify(endpoint);

  useEffect(() => {
    const es = new EventSource(
      `${bp}${endpoint.path}${endpoint.query && querystring(endpoint.query, "?")}`,
    );

    es.onmessage = ({ data: msg }) => {
      const raw: ThreadMessageDTO = JSON.parse(msg);
      consumeMessages([raw]);
    };

    return () => es.close();
  }, [consumeMessages, context, trigger]);
};

interface MessageGroup {
  author: UserDTO;
  displayDate: string;
  messages: ThreadMessageDTO[];
}
export interface ThreadView {
  id: string;
  type: ThreadType;
  groupedMessages: MessageGroup[];
}

class ThreadLocalState {
  @observable
  messageMap: Map<string, ThreadMessageDTO> = new Map();

  @observable
  pg: ThreadMessagePageDTO | undefined = undefined;

  @observable
  page: number | undefined = undefined;

  @computed
  public get thread(): Thread {
    const messagePool = this.pg
      ? this.pg.data
      : Array.from(this.messageMap.values());
    return {
      id: this.id,
      type: this.threadType,
      messages: messagePool
        .filter((t) => !t.deleted)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    };
  }

  @computed
  public get threadView(): ThreadView {
    const groupedMessages: MessageGroup[] = [];
    const thread = this.thread;

    const messages = [...thread.messages];

    let group: MessageGroup | undefined = undefined;
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
  }

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
      } else if (msg.deleted) {
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
    const latest = maxBy(this.thread.messages, (it) =>
      new Date(it.createdAt).getTime(),
    )?.createdAt;
    getApi()
      .forumApi.forumControllerGetMessages(
        this.id.toString(),
        this.threadType,
        latest ? new Date(latest).getTime() : undefined,
        loadCount,
        loadLatest ? SortOrder.DESC : SortOrder.ASC,
      )
      .then(this.consumeMessages);
  };

  @action updateThread = (threadType: ThreadType, id: string) => {
    this.threadType = threadType;
    this.id = id;
    this.pg = undefined;
    this.page = 0;
    this.messageMap.clear();
  };
}

// TODO: this is unoptimized mess
export const useThread = (
  id: string,
  threadType: ThreadType,
  initialMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO,
  loadLatest: boolean = false,
  page?: number,
  batchSize?: number,
): [
  ThreadView,
  ThreadDTO | undefined,
  () => void,
  (messages: ThreadMessageDTO[]) => void,
  pg: ThreadMessagePageDTO | undefined,
  (page: number) => void,
] => {
  const [trigger, setTrigger] = useState(0);
  const state = useLocalObservable<ThreadLocalState>(
    () =>
      new ThreadLocalState(id.toString(), threadType, initialMessages, page),
  );

  const { data: rawThread } = getApi().forumApi.useForumControllerGetThread(
    id.toString(),
    threadType,
  );

  const loadPage = useCallback(
    (page: number) => {
      getApi()
        .forumApi.forumControllerMessagesPage(id.toString(), threadType, page)
        .then((pg) => state.setPageData(pg));
    },
    [id, threadType],
  );

  // If threadId changes, we need to revalidate local state
  useEffect(() => {
    state.updateThread(threadType, id);
    state.loadMore(loadLatest, batchSize);
    console.log(`Effect ${threadType}_${id}`);
  }, [threadType, id]);

  useEffect(() => {
    if (page !== undefined && typeof window !== "undefined") {
      loadPage(page);
    }
  }, [loadPage, page]);

  const loadMore = useCallback(() => {
    state.loadMore(loadLatest, batchSize);
  }, [loadLatest, state]);

  useThreadEventSource(
    id.toString(),
    threadType,
    state.consumeMessages,
    trigger,
  );

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // We need to load more and re-create event source so that we don't die on thread
      loadMore();
      setTrigger((x) => x + 1);
    }
  }, [setTrigger, trigger]);

  useEffect(() => {
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false,
    );

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (typeof window === "undefined")
    return [
      state.threadView,
      undefined,
      () => undefined,
      () => undefined,
      state.pg,
      () => undefined,
    ];

  // If we are paginated, we return a page
  // otherwise all sorted

  return [
    state.threadView,
    rawThread,
    loadMore,
    state.consumeMessages,
    state.pg,
    loadPage,
  ];
};
