import { ThreadMessageDTO } from "@/api/back";
import cx from "clsx";
import c from "./ThreadsTable.module.scss";
import React from "react";
import { TimeAgo } from "../TimeAgo";
import { UserPreview } from "@/components/UserPreview";

export const ThreadMessagePreview = React.memo(function ThreadMessagePreview({
  message,
}: {
  message: ThreadMessageDTO;
}) {
  const { author } = message;
  return (
    <div className={cx(c.msg)}>
      <UserPreview avatarSize={30} user={author} roles>
        <TimeAgo date={message.createdAt} />
      </UserPreview>
    </div>
  );
});
