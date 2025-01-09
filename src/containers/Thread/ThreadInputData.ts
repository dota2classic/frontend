import { action, computed, makeObservable, observable } from "mobx";
import { ThreadMessageDTO } from "@/api/back";
import { ThreadContainer } from "@/containers/Thread/ThreadContainer";

export class ThreadInputData {
  @observable
  value: string = "";

  @observable
  replyingMessageId: string | undefined = undefined;

  @observable
  editingMessageId: string | undefined = undefined;

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
