import { ThreadMessageDTO } from "@/api/back";
import cx from "clsx";
import c from "./ThreadsTable.module.scss";
import TableClasses from "../GenericTable/GenericTable.module.scss";
import React from "react";
import { Username } from "@/components/Username/Username";
import { PlayerAvatar } from "../PlayerAvatar";
import { TimeAgo } from "../TimeAgo";

export const ThreadMessagePreview = React.memo(function ThreadMessagePreview({
  message,
}: {
  message: ThreadMessageDTO;
}) {
  const { author } = message;
  return (
    <div className={cx(c.msg)}>
      <PlayerAvatar
        user={author}
        className={TableClasses.avatar__small}
        width={30}
        height={30}
        alt=""
      />
      <div style={{ flex: 1 }}>
        <div className={c.block}>
          <Username user={message.author} roles />
        </div>
        <div style={{ whiteSpace: "nowrap" }} className={cx(c.block)}>
          <TimeAgo date={message.createdAt} />
        </div>
      </div>
    </div>
  );
});
