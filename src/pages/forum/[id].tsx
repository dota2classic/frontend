import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { Breadcrumbs, EmbedProps, PageLink, Panel, Thread } from "@/components";
import { getApi } from "@/api/hooks";
import { ThreadDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import { numberOrDefault } from "@/util/urls";
import React from "react";
import { ThreadStyle } from "@/components/Thread/types";

interface Props {
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
  page: number;
}

export default function ThreadPage({ messages, thread, page }: Props) {
  const r = useRouter();

  return (
    <>
      <EmbedProps
        title={`${thread.title}`}
        description={`Форум на сайте dotaclassic.ru: ${thread.title}`}
      />
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.index().link}>Форум</PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Panel>
      <Thread
        populateMessages={messages}
        threadType={ThreadType.FORUM}
        id={r.query.id as string}
        threadStyle={ThreadStyle.FORUM}
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

ThreadPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const tid = ctx.query.id as string;
  const page = numberOrDefault(ctx.query.page as string, 0);

  return {
    page,
    messages: await getApi().forumApi.forumControllerMessagesPage(
      tid,
      ThreadType.FORUM,
      page,
    ),
    thread: await getApi().forumApi.forumControllerGetThread(
      tid,
      ThreadType.FORUM,
    ),
  };
};
