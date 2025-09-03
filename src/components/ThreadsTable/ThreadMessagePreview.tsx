import { ThreadMessageDTO } from "@/api/back";
import cx from "clsx";
import c from "./ThreadsTable.module.scss";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import { PlayerAvatar, TimeAgo, UserPreview } from "@/components";
import React from "react";

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
      {/*<PlayerAvatar*/}
      {/*  user={author}*/}
      {/*  className={TableClasses.avatar__small}*/}
      {/*  width={30}*/}
      {/*  height={30}*/}
      {/*  alt=""*/}
      {/*/>*/}
      {/*<div style={{ flex: 1 }}>*/}
      {/*  <div className={c.block}>*/}
      {/*    <Username user={message.author} roles />*/}
      {/*  </div>*/}
      {/*  <div style={{ whiteSpace: "nowrap" }} className={cx(c.block)}>*/}
      {/*    */}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
});
