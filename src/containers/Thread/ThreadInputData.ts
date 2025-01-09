import { action, computed, makeObservable, observable } from "mobx";
import { ThreadMessageDTO } from "@/api/back";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";
import { VirtuosoHandle } from "react-virtuoso";

export class ThreadInputData {
  @observable
  value: string = "";

  @observable
  replyingMessageId: string | undefined = undefined;

  @observable
  editingMessageId: string | undefined = undefined;

  @observable.ref
  chatScrollRef: VirtuosoHandle | undefined = undefined;

  @computed
  public get replyingMessage(): ThreadMessageDTO | undefined {
    return (
      (this.replyingMessageId &&
        this.thread.messageMap.get(this.replyingMessageId)) ||
      undefined
    );
  }

  constructor(private readonly thread: ThreadContainer) {
    makeObservable(this);
  }

  public scrollIntoView = (messageId: string) => {
    const msg = this.thread.messageMap.get(messageId);
    if (!msg || msg.deleted) return;

    const idx = this.thread.pool.findIndex((d) => d[0].messageId === messageId);
    if (this.chatScrollRef) {
      this.chatScrollRef.scrollToIndex(idx);
    }
  };

  @action setScrollRef = (e: VirtuosoHandle | undefined) => {
    this.chatScrollRef = e;
  };

  @action setValue = (s: string) => {
    this.value = s;
  };

  @action setReplyMessageId = (messageId: string | undefined) => {
    this.replyingMessageId = messageId;
  };

  @action setEditMessage = (editingMessageId: string | undefined) => {
    this.editingMessageId = editingMessageId;
  };
}
