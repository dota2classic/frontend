import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { Breadcrumbs, EmbedProps, PageLink, Panel } from "@/components";
import { getApi } from "@/api/hooks";
import { ThreadDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { Thread } from "@/containers";
import { ThreadStyle } from "@/containers/Thread/types";
import { numberOrDefault } from "@/util/urls";

interface Props {
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
  page: number;
}

export default function TicketPage({ messages, thread, page }: Props) {
  const r = useRouter();

  return (
    <>
      <EmbedProps
        title={`${thread.title}`}
        description={`Тикет на сайте dotaclassic.ru: ${thread.title}`}
      />
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.ticket.index.link}>Тикеты</PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Panel>
      <br />
      <Thread
        populateMessages={messages}
        threadType={ThreadType.TICKET}
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

TicketPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const tid = ctx.query.id as string;
  const page = numberOrDefault(ctx.query.page as string, 0);

  const [messages, thread] = await Promise.combine([
    getApi().forumApi.forumControllerMessagesPage(tid, ThreadType.TICKET, page),
    getApi().forumApi.forumControllerGetThread(tid, ThreadType.TICKET),
  ]);

  return {
    page,
    messages,
    thread,
  };
};
