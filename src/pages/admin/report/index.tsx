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
import { useTranslation } from "react-i18next";

interface Props {
  reports: ReportPageDto;
  page: number;
}

export default function AdminReportsPage({ reports, page }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("admin_reports.seo.title")}
        description={t("admin_reports.seo.description")}
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
            <th>{t("admin_reports.complaintLink")}</th>
            <th>{t("admin_reports.rule")}</th>
            <th>{t("admin_reports.accused")}</th>
            <th>{t("admin_reports.plaintiff")}</th>
            <th>{t("admin_reports.complaintType")}</th>
            <th>{t("admin_reports.processed")}</th>
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
                  {t("admin_reports.complaint")}
                </PageLink>
              </td>
              <td>{report.rule.title}</td>
              <th>
                <UserPreview roles user={report.reported} />
              </th>
              <th>
                <UserPreview roles user={report.reporter} />
              </th>
              <th>
                {report.message
                  ? t("admin_reports.message")
                  : t("admin_reports.match")}
              </th>
              <th>
                <Checkbox checked={report.handled} onChange={() => undefined}>
                  {report.handled
                    ? t("admin_reports.processedYes")
                    : t("admin_reports.processedNo")}
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
