import { observer } from "mobx-react-lite";
import { Panel, PlayerAvatar, UserPreview } from "@/components";
import cx from "clsx";
import c from "./MessageInput.module.scss";
import { IoSend } from "react-icons/io5";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AddEmoticonButton } from "./AddEmoticonButton";
import { MdClose } from "react-icons/md";
import { ThreadMessageDTO, UserDTO } from "@/api/back";
import { useGreedyFocus } from "@/util/useTypingCallback";
import { useTranslation } from "react-i18next";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { getApi } from "@/api/hooks";
import { useStore } from "@/store";

const regex = /https?:\/\/dotaclassic\.ru\/players\/(\d+)(?:\/)?/;

const useSearchUsers = () => {
  const { user } = useStore();

  return (query: string, callback: (data: SuggestionDataItem[]) => void) => {
    getApi()
      .playerApi.playerControllerSearch(query, 10)
      .then(async (data) => {
        await user.populate(data);
        return data;
      })
      .then((data) =>
        callback(
          data.map((item) => ({
            id: item.steamId,
            display: item.name,
            user: item,
          })),
        ),
      );
  };
};

export const MessageInput = observer(function MessageInput(p: {
  canMessage: boolean;
  onMessage: (content: string) => Promise<void>;
  className?: string;

  value: string;
  setValue: (v: string) => void;

  onEscape?: () => void;
  replyMessage?: ThreadMessageDTO;
  cancelReply?: () => void;
  greedyFocus?: number;
}) {
  const { t } = useTranslation();
  const { value, setValue } = p;
  const { user } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = useSearchUsers();

  useGreedyFocus(p.greedyFocus, textareaRef);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        p.onEscape?.();
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [p]);

  const isValid = value.trim().length >= 2;

  const submit = useCallback(() => {
    if (!isValid) {
      setError(t("message_input.tooShortMessage"));
      return;
    }
    // Do it optimistically, first
    const msg = value;
    setValue("");

    p.onMessage(msg).catch((err) => {
      if (err.status === 403) {
        setError(t("message_input.forbiddenMessage"));
      } else {
        setError(t("message_input.tooFrequentMessages"));
      }
      setValue(msg);
    });
  }, [isValid, p, t, value]);

  const onEnterKeyPressed = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        // enter
        submit();
      }
    },
    [submit],
  );

  const insertAtCursor = useCallback(
    (insert: string) => {
      const myField = textareaRef.current;
      if (!myField) return;
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        insert +
        myField.value.substring(endPos, myField.value.length);

      setValue(myField.value);
    },
    [p],
  );

  return (
    <Panel className={cx(c.createMessageContainer, p.className)}>
      {p.replyMessage && (
        <div className={c.replyMessage}>
          {t("message_input.replyToMessage")}
          <PlayerAvatar
            user={p.replyMessage.author}
            width={20}
            height={20}
            alt={""}
          />
          <span className={c.replyMessage__name}>
            {p.replyMessage.author.name}
          </span>
          <MdClose onClick={p.cancelReply} />
        </div>
      )}
      <div className={cx(c.createMessage, p.className)}>
        <MentionsInput
          onKeyDown={onEnterKeyPressed}
          inputRef={textareaRef}
          className={c.text}
          value={value}
          forceSuggestionsAboveCursor
          onChange={(e, newValue) => {
            setError(null);
            setValue(newValue);
          }}
          customSuggestionsContainer={(children) => (
            <div style={{ zIndex: 500 }} className={c.suggestion_list}>
              {children}
            </div>
          )}
          readOnly={!p.canMessage}
          placeholder={
            p.canMessage
              ? t("message_input.enterMessage")
              : t("message_input.noPermission")
          }
        >
          <Mention
            trigger="@"
            style={{
              background: "rgb(77, 169, 243, 0.2)",
              borderRadius: 8,
              padding: "0.3ch",
            }}
            markup="https://dotaclassic.ru/players/__id__"
            regex={regex}
            displayTransform={(id) =>
              `@${user.tryGetUser(id).entry?.user?.name || id}`
            }
            data={searchUsers}
            appendSpaceOnAdd
            renderSuggestion={(
              entry: SuggestionDataItem & { user: UserDTO },
              _search,
              _highlight,
              _index,
              focus,
            ) => (
              <UserPreview
                className={cx(c.suggestion, focus && c.focused)}
                avatarSize={20}
                user={entry.user}
                nolink
              />
            )}
          />
        </MentionsInput>

        <div className={c.buttons}>
          <button className={c.buttonWrapper}>
            <AddEmoticonButton
              onAddReaction={(emo) => {
                insertAtCursor(` :${emo.code}: `);
              }}
            />
          </button>
          <button className={c.buttonWrapper}>
            <IoSend className={error ? "red" : undefined} onClick={submit} />
          </button>
        </div>
      </div>
      <div className={cx(c.test, error && c.visible)}>{error || ""}</div>
    </Panel>
  );
});
