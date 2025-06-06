import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ThreadPageDTO, ThreadType } from "@/api/back";
import { EmbedProps, Pagination, ThreadsTable } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";
import { ForumTabs } from "@/containers";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function AdminTicketsPage({ threads, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />
      <div className={c.buttons}>
        <ForumTabs />
      </div>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.ticket.admin(page).link}
        />
      )}
      <ThreadsTable threads={threads} />
    </>
  );
}

AdminTicketsPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    false,
    15,
    ThreadType.TICKET,
  );

  return {
    threads,
    page,
  };
};
