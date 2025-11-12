import React, { useCallback, useEffect, useRef } from "react";
import { GenericModal } from "@/components/GenericModal";
import { observer, useLocalObservable } from "mobx-react-lite";
import c from "./RconModal.module.scss";
import cx from "clsx";
import { GreedyFocusPriority } from "@/util/useTypingCallback";
import { MessageInput } from "@/components/MessageInput";
import { runInAction } from "mobx";
import { getApi } from "@/api/hooks";
import { handleException } from "@/util/handleException";
import { threadFont } from "@/const/fonts";

interface IRconModalProps {
  onClose: () => void;
  serverUrl?: string;
}

interface Store {
  counter: number;
  messages: { timestamp: number; input: boolean; value: string }[];
  text: string;
  setText: (txt: string) => void;
  appendMessage: (txt: string, input: boolean) => void;
}

export const RconModal: React.FC<IRconModalProps> = observer(
  ({ onClose, serverUrl }) => {
    const store = useLocalObservable<Store>(() => ({
      counter: 0,
      messages: [],
      text: "",
      setText(text: string) {
        runInAction(() => (this.text = text));
      },
      appendMessage(txt: string, input: boolean) {
        runInAction(() => {
          if (input) {
            this.setText("");
          }
          this.messages.push({
            timestamp: ++this.counter,
            input,
            value: txt,
          });
        });
      },
    }));

    const sendMessage = useCallback(
      async (msg: string) => {
        if (!serverUrl) return;
        try {
          const response = await getApi().adminApi.serverControllerRunRcon({
            serverUrl,
            command: msg,
          });
          store.appendMessage(msg, true);
          store.appendMessage(response.response, false);
        } catch (e) {
          await handleException("Ошибка RCON", e);
        }
      },
      [serverUrl, store],
    );

    useEffect(() => {
      runInAction(() => {
        store.messages = [];
        store.counter = 0;
        store.text = "";
      });
    }, [serverUrl, store]);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, [store.messages.length]);

    if (!serverUrl) return null;
    return (
      <GenericModal
        title={"RCON команды"}
        onClose={onClose}
        className={threadFont.className}
      >
        <div ref={scrollRef} className={c.messages}>
          {store.messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={cx(c.message, msg.input ? c.input : c.output)}
            >
              {msg.value}
            </div>
          ))}
        </div>
        <MessageInput
          value={store.text}
          setValue={store.setText}
          greedyFocus={GreedyFocusPriority.REPORT_MODAL}
          canMessage={true}
          onMessage={sendMessage}
          replyMessage={undefined}
          cancelReply={() => undefined}
        />
      </GenericModal>
    );
  },
);
