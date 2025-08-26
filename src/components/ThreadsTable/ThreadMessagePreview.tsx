import { ThreadMessageDTO } from "@/api/back";
import cx from "clsx";
import c from "./ThreadsTable.module.scss";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import { PlayerAvatar, TimeAgo } from "@/components";
import React from "react";
import { Username } from "@/components/Username/Username";
import { useTranslation } from "react-i18next";

export const ThreadMessagePreview = React.memo(function ThreadMessagePreview({
  message,
}: {
  message: ThreadMessageDTO;
}) {
  const { author } = message;
  const { t } = useTranslation();
  return (
    <div className={cx(c.msg)}>
      <PlayerAvatar
        user={author}
        className={TableClasses.avatar__small}
        width={30}
        height={30}
        alt={t("threads_table.avatarAlt", { name: author.name })}
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
