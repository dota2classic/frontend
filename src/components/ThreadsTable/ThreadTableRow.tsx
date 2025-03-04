import { observer } from "mobx-react-lite";
import { ThreadDTO, ThreadType } from "@/api/back";
import React from "react";
import { FaUser } from "react-icons/fa";
import { SiDota2 } from "react-icons/si";
import { FaMessage } from "react-icons/fa6";
import c from "./ThreadsTable.module.scss";
import { PageLink, UserPreview } from "@/components";
import { AppRouter } from "@/route";
import { ThreadMessagePreview } from "@/components/ThreadsTable/ThreadMessagePreview";

export const ThreadTableRow = observer(
  ({ thread }: { thread: ThreadDTO; mutate: () => void }) => {
    // const isAdmin = useStore().auth.isAdmin;
    // const togglePin = useCallback(() => {
    //   getApi()
    //     .forumApi.forumControllerUpdateThread(thread.id, {
    //       pinned: !thread.pinned,
    //     })
    //     .then(() => mutate());
    // }, [thread.id, thread.pinned, mutate]);

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
          {op && <UserPreview avatarSize={30} user={op} />}
        </td>
        <td>
          {thread.lastMessage && (
            <ThreadMessagePreview message={thread.lastMessage} />
          )}
        </td>
        {/*<td className="omit">*/}
        {/*  {isAdmin ? (*/}
        {/*    <FaMapPin*/}
        {/*      className={cx("adminicon", thread.pinned ? "green" : "red")}*/}
        {/*      onClick={togglePin}*/}
        {/*    />*/}
        {/*  ) : thread.pinned ? (*/}
        {/*    <FaMapPin className={c.icon} />*/}
        {/*  ) : null}*/}
        {/*  {thread.adminOnly ? (*/}
        {/*    <MdAdminPanelSettings*/}
        {/*      style={{ scale: 1.2, marginBottom: 2 }}*/}
        {/*      className={c.icon}*/}
        {/*    />*/}
        {/*  ) : null}*/}
        {/*</td>*/}
      </tr>
    );
  },
);
