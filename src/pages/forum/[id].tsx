import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { ThreadDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import { parsePage } from "@/util/urls";
import React from "react";
import { PaginatedThread } from "@/containers/Thread";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";
import { Surface } from "@/components/Surface";
import { getRequestApi } from "@/api/request-api";

interface Props {
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
  page: number;
}

export default function ThreadPage({ messages, thread, page }: Props) {
  const r = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("forum_thread.seo.title", { title: thread.title })}
        description={t("forum_thread.seo.description", { title: thread.title })}
      />
      <Surface padding="xs" variant="panel">
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.index().link}>
            {t("forum_thread.forum")}
          </PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Surface>
      <PaginatedThread
        populateMessages={messages}
        threadType={ThreadType.FORUM}
        id={r.query.id as string}
        pagination={{
          page: page,
          perPage: 25,
          pageProvider: (p) =>
            AppRouter.forum.thread(thread.externalId, thread.threadType, p)
              .link,
        }}
      />
    </>
  );
}

ThreadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const api = getRequestApi(ctx);
  const tid = ctx.query.id as string;
  const page = parsePage(ctx.query.page);

  return {
    page,
    messages: await api.forumApi.forumControllerMessagesPage(
      tid,
      ThreadType.FORUM,
      page,
    ),
    thread: await api.forumApi.forumControllerGetThread(tid, ThreadType.FORUM),
  };
};
