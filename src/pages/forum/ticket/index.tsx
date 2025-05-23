import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ThreadPageDTO, ThreadType } from "@/api/back";
import {
  Button,
  EmbedProps,
  PageLink,
  Pagination,
  ThreadsTable,
} from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function TicketsPage({ threads, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />
      <div className={c.buttons}>
        <PageLink
          link={AppRouter.forum.createThread(ThreadType.TICKET).link}
          className={c.createThread}
        >
          <Button>Новый тикет</Button>
        </PageLink>
        <PageLink
          link={AppRouter.forum.index().link}
          className={c.createThread}
        >
          <Button>Все темы</Button>
        </PageLink>
      </div>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.index(page).link}
        />
      )}
      <ThreadsTable threads={threads} />
    </>
  );
}

TicketsPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    true,
    15,
    ThreadType.TICKET,
  );

  return {
    threads,
    page,
  };
};
