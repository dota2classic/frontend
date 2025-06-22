import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ReportPageDto } from "@/api/back";
import {
  Checkbox,
  EmbedProps,
  PageLink,
  Pagination,
  Table,
  UserPreview,
} from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";
import { ForumTabs } from "@/containers";

interface Props {
  reports: ReportPageDto;
  page: number;
}

export default function AdminReportsPage({ reports, page }: Props) {
  return (
    <>
      <EmbedProps
        title="Форум"
        description="Dota2Classic форум - место для обсуждения матчей, игроков, героев и прочих важных вопросов"
      />
      <div className={c.buttons}>
        <ForumTabs />
      </div>
      {reports.pages > 1 && (
        <Pagination
          page={page}
          maxPage={reports.pages}
          linkProducer={(page) => AppRouter.forum.report.admin(page).link}
        />
      )}
      <Table className="very-compact">
        <thead>
          <tr>
            <th>Ссылка на жалобу</th>
            <th>Правило</th>
            <th>Обвиняемый</th>
            <th>Истец</th>
            <th>Тип жалобы</th>
            <th>Обработана?</th>
          </tr>
        </thead>
        <tbody>
          {reports.data.map((report) => (
            <tr key={report.id}>
              <td>
                <PageLink
                  className="link"
                  link={AppRouter.forum.report.report(report.id).link}
                >
                  Жалоба
                </PageLink>
              </td>
              <td>{report.rule.title}</td>
              <th>
                <UserPreview user={report.reported} />
              </th>
              <th>
                <UserPreview user={report.reporter} />
              </th>
              <th>{report.message ? "Сообщение" : "Матч"}</th>
              <th>
                <Checkbox checked={report.handled} onChange={() => undefined}>
                  {report.handled ? "Обработана" : "Требует обработки"}
                </Checkbox>
              </th>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

AdminReportsPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const reports = await getApi().report.reportControllerGetReportPage(page, 15);

  return {
    reports,
    page,
  };
};
