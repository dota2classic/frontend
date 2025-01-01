import React, { useContext } from "react";
import c from "@/components/Message/Message.module.scss";
import cx from "clsx";
import { ReactionEntry } from "@/api/back";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { AddReactionTool } from "@/components/Message/tools/AddReactionTool";
import { ThreadContext } from "@/containers/Thread/threadContext";

interface Props {
  messageId: string;
  reactions: ReactionEntry[];
}
export const MessageReactions = React.memo(
  observer(function MessageReactions({ messageId, reactions }: Props) {
    const mySteamId = useStore().auth.parsedToken?.sub;
    const ctx = useContext(ThreadContext);

    return (
      <div
        className={cx(c.reactions, reactions.length && c.reactions__nonempty)}
      >
        {reactions.map((reaction) => (
          <div
            key={reaction.emoticon.id}
            onClick={() => ctx.thread.react(messageId, reaction.emoticon.id)}
            className={cx(
              c.reaction,
              reaction.reacted.findIndex(
                (reactor) => reactor.steamId === mySteamId,
              ) !== -1 && c.reaction__active,
            )}
          >
            <img src={reaction.emoticon.src} alt="" />
            <span>{reaction.reacted.length}</span>
          </div>
        ))}

        {reactions.length ? (
          <div className={cx(c.reaction)}>
            <AddReactionTool messageId={messageId} />
          </div>
        ) : null}
      </div>
    );
  }),
);
