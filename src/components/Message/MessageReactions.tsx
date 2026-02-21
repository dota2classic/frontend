import React, { useContext } from "react";
import c from "./Message.module.scss";
import cx from "clsx";
import { ReactionEntry } from "@/api/back";
import { observer } from "mobx-react-lite";
import { AddReactionTool } from "./tools/AddReactionTool";
import { ThreadContext } from "@/containers/Thread/threadContext";
import { useTranslation } from "react-i18next";

interface Props {
  messageId: string;
  reactions: ReactionEntry[];
}
export const MessageReactions = observer(function MessageReactions({
  messageId,
  reactions,
}: Props) {
  const { t } = useTranslation();

  const thread = useContext(ThreadContext);

  return (
    <div className={cx(c.reactions, reactions.length && c.reactions__nonempty)}>
      {reactions.map((reaction) => (
        <div
          key={reaction.emoticon.id}
          onClick={() => thread.react(messageId, reaction.emoticon.id)}
          className={cx(c.reaction, reaction.myReaction && c.reaction__active)}
        >
          <img src={reaction.emoticon.src} alt="" />
          <span>
            {t("message_reactions.reactionCount", {
              count: reaction.reactedCount,
            })}
          </span>
        </div>
      ))}

      {reactions.length ? (
        <div className={cx(c.reaction)}>
          <AddReactionTool messageId={messageId} />
        </div>
      ) : null}
    </div>
  );
});
