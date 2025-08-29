import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ThreadPageDTO, ThreadType } from "@/api/back";
import { EmbedProps, Pagination, ThreadsTable } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";
import { ForumTabs } from "@/containers";
import { useTranslation } from "react-i18next";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function AdminTicketsPage({ threads, page }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("admin_tickets.seo.title")}
        description={t("admin_tickets.seo.description")}
        noindex
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
