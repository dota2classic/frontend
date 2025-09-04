import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { getApi } from "@/api/hooks";
import { ThreadDTO, ThreadMessagePageDTO } from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { numberOrDefault } from "@/util/urls";
import { PaginatedThread } from "@/containers/Thread";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { Panel } from "@/components/Panel";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";

interface Props {
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
  page: number;
}

export default function TicketPage({ messages, thread, page }: Props) {
  const r = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("ticket_page.seo.title", { title: thread.title })}
        description={`${t("ticket_page.seo.description", { title: thread.title })}`}
      />
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.ticket.index().link}>
            {t("ticket_page.tickets")}
          </PageLink>
          <span>{thread.title}</span>
        </Breadcrumbs>
      </Panel>
      <br />
      <PaginatedThread
        populateMessages={messages}
        threadType={ThreadType.TICKET}
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
