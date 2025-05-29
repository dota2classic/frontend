import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { Breadcrumbs, EmbedProps, PageLink, Panel } from "@/components";
import { getApi } from "@/api/hooks";
import { ThreadDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { numberOrDefault } from "@/util/urls";
import { PaginatedThread } from "@/containers/Thread/PaginatedThread";

interface Props {
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
  page: number;
}

export default function ReportPage({ messages, thread, page }: Props) {
  const r = useRouter();

  return (
    <>
      <EmbedProps
        title={`${thread.title}`}
        description={`Жалоба на сайте dotaclassic.ru: ${thread.title}`}
      />
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.report.index().link}>Жалобы</PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Panel>
      <br />
      <PaginatedThread
        populateMessages={messages}
        threadType={ThreadType.REPORT}
        id={r.query.id as string}
        pagination={{
          page: numberOrDefault(page, 0),
          pageProvider: (p) =>
            AppRouter.forum.thread(thread.externalId, thread.threadType, p)
              .link,
        }}
      />
    </>
  );
}

ReportPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const tid = ctx.query.id as string;
  const page = numberOrDefault(ctx.query.page as string, 0);

  const [messages, thread] = await Promise.combine([
    getApi().forumApi.forumControllerMessagesPage(tid, ThreadType.REPORT, page),
    getApi().forumApi.forumControllerGetThread(tid, ThreadType.REPORT),
  ]);

  return {
    page,
    messages,
    thread,
  };
};
