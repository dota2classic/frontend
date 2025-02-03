import { observer } from "mobx-react-lite";
import { ThreadDTO, ThreadType } from "@/api/back";
import { useStore } from "@/store";
import React, { useCallback } from "react";
import { getApi } from "@/api/hooks";
import { FaMapPin, FaUser } from "react-icons/fa";
import { SiDota2 } from "react-icons/si";
import { FaMessage } from "react-icons/fa6";
import c from "./ThreadsTable.module.scss";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import Image from "next/image";
import cx from "clsx";
import { MdAdminPanelSettings } from "react-icons/md";
import { ThreadMessagePreview } from "@/components/ThreadsTable/ThreadMessagePreview";

export const ThreadTableRow = observer(
  ({ thread, mutate }: { thread: ThreadDTO; mutate: () => void }) => {
    const isAdmin = useStore().auth.isAdmin;
    const togglePin = useCallback(() => {
      getApi()
        .forumApi.forumControllerUpdateThread(thread.id, {
          pinned: !thread.pinned,
        })
        .then(() => mutate());
    }, [thread.id, thread.pinned, mutate]);

    const op = thread.originalPoster;

    return (
      <tr key={thread.externalId}>
        <td style={{ textAlign: "center" }}>
          {thread.threadType === ThreadType.PLAYER ? (
            <FaUser />
          ) : thread.threadType === ThreadType.MATCH ? (
            <SiDota2 />
          ) : (
            <FaMessage />
          )}
        </td>
        <td className={c.forumTitle}>
          <PageLink
            link={
              AppRouter.forum.thread(thread.externalId, thread.threadType).link
            }
          >
            {thread.title}
          </PageLink>
        </td>
        <td className="omit">
          {thread.newMessageCount > 0 ? (
            <>
              {thread.messageCount - thread.newMessageCount}{" "}
              <span className={c.newMessages}>+{thread.newMessageCount}</span>
            </>
          ) : (
            <>{thread.messageCount}</>
          )}
        </td>
        <td className="omit">{thread.views}</td>
        <td className="omit">
          {op && (
            <PageLink
              link={AppRouter.players.player.index(op.steamId).link}
              className={TableClasses.player}
            >
              <Image
                width={30}
                height={30}
                className={TableClasses.avatar__small}
                src={op.avatar || "/avatar.png"}
                alt=""
              />
              <div style={{ marginLeft: 6 }}>
                {Number(op.steamId) > 10 ? op.name : "Бот"}
              </div>
            </PageLink>
          )}
        </td>
        <td>
          {thread.lastMessage && (
            <ThreadMessagePreview message={thread.lastMessage} />
          )}
        </td>
        <td className="omit">
          {isAdmin ? (
            <FaMapPin
              className={cx("adminicon", thread.pinned ? "green" : "red")}
              onClick={togglePin}
            />
          ) : thread.pinned ? (
            <FaMapPin className={c.icon} />
          ) : null}
          {thread.adminOnly ? (
            <MdAdminPanelSettings
              style={{ scale: 1.2, marginBottom: 2 }}
              className={c.icon}
            />
          ) : null}
        </td>
      </tr>
    );
  },
);
