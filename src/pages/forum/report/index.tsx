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

export default function ReportsPage({ threads, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Жалобы"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />
      <div className={c.buttons}>
        <ForumTabs />
      </div>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.report.index(page).link}
        />
      )}
      <ThreadsTable threads={threads} />
    </>
  );
}

ReportsPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    true,
    15,
    ThreadType.REPORT,
  );

  return {
    threads,
    page,
  };
};
