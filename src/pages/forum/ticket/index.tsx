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
import { ForumTabs } from "@/containers";
import { useTranslation } from "react-i18next";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function TicketsPage({ threads, page }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("forum.support")}
        description={t("forum.description")}
      />
      <div className={c.buttons}>
        <ForumTabs />
        <PageLink
          link={AppRouter.forum.createThread(ThreadType.TICKET).link}
          className={c.createThread}
        >
          <Button>{t("forum.newTicket")}</Button>
        </PageLink>
      </div>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.ticket.index(page).link}
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
