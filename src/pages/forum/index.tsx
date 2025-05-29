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
import c from "./Forum.module.scss";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { ForumTabs } from "@/containers";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function ForumIndexPage({ threads, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />

      <div className={c.buttons}>
        <ForumTabs />
        <PageLink
          link={AppRouter.forum.createThread(ThreadType.FORUM).link}
          className={c.createThread}
        >
          <Button>Новая тема</Button>
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

ForumIndexPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    false,
    15,
    ThreadType.FORUM,
  );

  return {
    threads,
    page,
  };
};
