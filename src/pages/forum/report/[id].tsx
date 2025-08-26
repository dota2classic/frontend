import { useRouter } from "next/router";
import { ThreadType } from "@/api/mapped-models";
import { Breadcrumbs, EmbedProps, PageLink, Panel } from "@/components";
import { getApi } from "@/api/hooks";
import {
  ReportDto,
  RulePunishmentDto,
  ThreadDTO,
  ThreadMessagePageDTO,
} from "@/api/back";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { numberOrDefault } from "@/util/urls";
import { PaginatedThread } from "@/containers/Thread/PaginatedThread";
import { ReportCard } from "@/containers";
import { useTranslation } from "react-i18next";

interface Props {
  messages: ThreadMessagePageDTO;
  thread?: ThreadDTO;
  page: number;
  report: ReportDto;
  punishments: RulePunishmentDto[];
}

export default function ReportPage({
  messages,
  thread,
  page,
  punishments,
  report,
}: Props) {
  const r = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={thread?.title || t("report_page.defaultTitle")}
        description={`${t("report_page.reportDescription")}: ${thread?.title || ""}`}
      />
      <Panel>
        <Breadcrumbs>
          <PageLink link={AppRouter.forum.report.index().link}>
            {t("report_page.reports")}
          </PageLink>
          <span>{thread?.title}</span>
        </Breadcrumbs>
      </Panel>
      <br />
      <ReportCard report={report} punishments={punishments} />
      <br />
      {(thread && (
        <PaginatedThread
          populateMessages={messages}
          threadType={ThreadType.REPORT}
          id={r.query.id as string}
          pagination={{
            page: numberOrDefault(page, 0),
            pageProvider: (p) =>
              AppRouter.forum.thread(thread!.externalId, thread!.threadType, p)
                .link,
          }}
        />
      )) ||
        t("report_page.loadError")}
    </>
  );
}

ReportPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const tid = ctx.query.id as string;
  const page = numberOrDefault(ctx.query.page as string, 0);

  const [messages, thread, report, punishments] = await Promise.combine([
    getApi()
      .forumApi.forumControllerMessagesPage(tid, ThreadType.REPORT, page)
      .catch(() => ({ page: 0, perPage: 0, pages: 0, data: [] })),
    getApi()
      .forumApi.forumControllerGetThread(tid, ThreadType.REPORT)
      .catch(() => undefined),
    getApi().report.reportControllerGetReport(tid),
    getApi().rules.ruleControllerGetAllPunishments(),
  ]);

  return {
    page,
    messages,
    thread,
    report,
    punishments,
  };
};
