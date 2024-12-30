import { getApi } from "@/api/hooks";
import React, { useEffect } from "react";
import {
  EmoticonDto,
  querystring,
  SortOrder,
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

export interface GroupedMessages {
  author: UserDTO;
  displayDate: string;
  messages: ThreadMessageDTO[];
}
export interface ThreadView {
  id: string;
  type: ThreadType;
  groupedMessages: GroupedMessages[];
}

export class ThreadLocalState {
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
    const groupedMessages: GroupedMessages[] = [];
    const thread = this.thread;

    const messages = [...thread.messages];

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
      ? maxBy(this.thread.messages, (it) => new Date(it.createdAt).getTime())
          ?.createdAt
      : maxBy(this.thread.messages, (it) => -new Date(it.createdAt).getTime())
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
    this.threadType = threadType;
    this.id = id;
    this.pg = undefined;
    this.page = 0;
    this.messageMap.clear();
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
}

export interface ThreadContextData {
  thread: ThreadLocalState;
  emoticons: EmoticonDto[];
}

export const ThreadContext = React.createContext<ThreadContextData>(
  {} as unknown as never,
);

export const useNewThread = (
  id: string,
  threadType: ThreadType,
  initialMessages?: ThreadMessageDTO[] | ThreadMessagePageDTO,
  loadLatest: boolean = false,
  page?: number,
  batchSize: number = 100,
): ThreadLocalState => {
  const thread = useLocalObservable<ThreadLocalState>(
    () =>
      new ThreadLocalState(id.toString(), threadType, initialMessages, page),
  );

  useThreadEventSource(id.toString(), threadType, thread.consumeMessages, 0);

  useEffect(() => {
    if (page !== undefined) {
      thread.loadPage(0);
    } else {
      thread.loadMore(loadLatest, batchSize);
    }
  }, [id]);

  useEffect(() => {
    if (page !== undefined) {
      thread.loadPage(page);
    }
  }, [page]);

  return thread;
};
