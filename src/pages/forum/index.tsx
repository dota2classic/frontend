import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import {
  ThreadDTO,
  ThreadMessageDTO,
  ThreadPageDTO,
  ThreadType,
} from "@/api/back";
import {
  Button,
  EmbedProps,
  PageLink,
  Pagination,
  Table,
  TimeAgo,
} from "@/components";
import { FaMapPin, FaUser } from "react-icons/fa";
import c from "./Forum.module.scss";
import { AppRouter } from "@/route";
import { SiDota2 } from "react-icons/si";
import { FaMessage } from "react-icons/fa6";
import React, { useCallback } from "react";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import cx from "clsx";
import { NextPageContext } from "next";
import Image from "next/image";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useDidMount } from "@/util/hooks";
import { MdAdminPanelSettings } from "react-icons/md";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

const Msg = ({ message }: { message: ThreadMessageDTO }) => {
  const { author } = message;
  return (
    <div className={cx(c.msg, TableClasses.player)}>
      <Image
        className={TableClasses.avatar__small}
        src={author.avatar}
        width={30}
        height={30}
        alt=""
      />
      <div style={{ flex: 1 }}>
        <PageLink
          className={c.block}
          link={AppRouter.players.player.index(message.author.steamId).link}
        >
          {author.name}
        </PageLink>
        <div style={{ marginLeft: 6 }} className={cx(c.block)}>
          <TimeAgo date={message.createdAt} />
        </div>
      </div>
    </div>
  );
};

const RowRenderer = observer(
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
        <td>
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
        <td>{thread.lastMessage && <Msg message={thread.lastMessage} />}</td>
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

export default function ForumIndexPage({ threads, page }: Props) {
  const mounted = useDidMount();
  const { data, mutate } = getApi().forumApi.useForumControllerThreads(
    page,
    undefined,
    ThreadType.FORUM,
    {
      fallbackData: threads,
      isPaused() {
        return !mounted;
      },
    },
  );

  const threadsData = data || threads;

  return (
    <>
      <EmbedProps
        title="Форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />

      <PageLink
        link={AppRouter.forum.createThread.link}
        className={c.createThread}
      >
        <Button>Новая тема</Button>
      </PageLink>
      {threadsData.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threadsData.pages}
          linkProducer={(page) => AppRouter.forum.index(page).link}
        />
      )}
      <Table className={c.forumTable}>
        <thead>
          <tr>
            <th style={{ width: 20 }}></th>
            {/*<th style={{ width: 10 }}>M</th>*/}
            <th>Топик</th>
            <th className="omit" style={{ width: 40 }}>
              Сообщений
            </th>
            <th className="omit" style={{ width: 40 }}>
              Просмотров
            </th>
            <th className="omit" style={{ width: 200 }}>
              Автор
            </th>
            <th>Последнее сообщение</th>
            <th className="omit"></th>
          </tr>
        </thead>
        <tbody>
          {threadsData.data.map((thread) => (
            <RowRenderer mutate={mutate} thread={thread} key={thread.id} />
          ))}
        </tbody>
      </Table>
    </>
  );
}

ForumIndexPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    undefined,
    ThreadType.FORUM,
  );

  return {
    threads,
    page,
  };
};
