import { useApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ThreadMessageDTO, ThreadPageDTO, ThreadType } from "@/api/back";
import {
  Button,
  EmbedProps,
  PageLink,
  Pagination,
  Table,
  TimeAgo,
} from "@/components";
import { FaUser } from "react-icons/fa";
import c from "./Forum.module.scss";
import { AppRouter } from "@/route";
import { SiDota2 } from "react-icons/si";
import { FaMessage } from "react-icons/fa6";
import React from "react";
import TableClasses from "@/components/GenericTable/GenericTable.module.scss";
import cx from "classnames";
import { NextPageContext } from "next";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

const Msg = ({ message }: { message: ThreadMessageDTO }) => {
  const { author } = message;
  return (
    <div className={cx(c.msg, TableClasses.player)}>
      <img className={TableClasses.avatar__small} src={author.avatar} alt="" />
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

export default function ForumIndexPage({ threads, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Dota2Classic форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и важных вопросов"
      />

      <PageLink
        link={AppRouter.forum.createThread.link}
        className={c.createThread}
      >
        <Button>Новая тема</Button>
      </PageLink>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.index(page).link}
        />
      )}
      <Table className={c.forumTable}>
        <thead>
          <tr>
            <th style={{ width: 20 }}></th>
            {/*<th style={{ width: 10 }}>M</th>*/}
            <th>Топик</th>
            <th style={{ width: 40 }}>Сообщений</th>
            <th style={{ width: 40 }}>Просмотров</th>
            <th style={{ width: 200 }}>Автор</th>
            <th>Последнее сообщение</th>
          </tr>
        </thead>
        <tbody>
          {threads.data.map((thread) => (
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
                    AppRouter.forum.thread(thread.externalId, thread.threadType)
                      .link
                  }
                >
                  {thread.title}
                </PageLink>
              </td>
              <td>
                {thread.newMessageCount > 0 ? (
                  <>
                    {thread.messageCount - thread.newMessageCount}{" "}
                    <span className={c.newMessages}>
                      +{thread.newMessageCount}
                    </span>
                  </>
                ) : (
                  <>{thread.messageCount}</>
                )}
              </td>
              <td>{thread.views}</td>
              <td>
                <PageLink
                  link={
                    AppRouter.players.player.index(
                      thread.originalPoster.steamId,
                    ).link
                  }
                  className={TableClasses.player}
                >
                  <img
                    className={TableClasses.avatar__small}
                    src={thread.originalPoster.avatar || "/avatar.png"}
                    alt=""
                  />
                  <div style={{ marginLeft: 6 }}>
                    {Number(thread.originalPoster.steamId) > 10
                      ? thread.originalPoster.name
                      : "Бот"}
                  </div>
                </PageLink>
              </td>
              <td>
                <Msg message={thread.lastMessage} />
              </td>
            </tr>
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

  const threads = await useApi().forumApi.forumControllerThreads(page);

  return {
    threads,
    page,
  };
};
