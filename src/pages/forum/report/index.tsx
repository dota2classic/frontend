import { parsePage } from "@/util/urls";
import { ThreadPageDTO, ThreadType } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { Pagination } from "@/components/Pagination";
import { ThreadsTable } from "@/components/ThreadsTable";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";
import { ForumTabs } from "@/containers/ForumTabs";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function ReportsPage({ threads, page }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("forum_reports.seo.title")}
        description={t("forum_reports.seo.description")}
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
  const api = getRequestApi(ctx);
  const page = parsePage(ctx.query.page);

  const threads = await api.forumApi.forumControllerThreads(
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
