import React from "react";

import c from "./MessageReactionsTooltip.module.scss";
import { ReactionEntry } from "@/api/back";
import { PlayerAvatar } from "@/components";

interface IMessageReactionsTooltipProps {
  reaction: ReactionEntry;
}

export const MessageReactionsTooltip: React.FC<
  IMessageReactionsTooltipProps
> = ({ reaction }) => {
  return (
    <div className={c.tooltip}>
      {reaction.reacted.map((user) => (
        <div className={c.reacted} key={user.steamId}>
          <PlayerAvatar src={user.avatar} alt="" width={20} height={20} />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};
