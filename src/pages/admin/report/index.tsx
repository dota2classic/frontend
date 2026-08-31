import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ReportPageDto } from "@/api/back";
import { AppRouter } from "@/route";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import c from "@/pages/forum/Forum.module.scss";
import { ForumTabs } from "@/containers/ForumTabs";
import { EmbedProps } from "@/components/EmbedProps";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { PageLink } from "@/components/PageLink";
import { UserPreview } from "@/components/UserPreview";
import { Checkbox } from "@/components/Checkbox";
import { Button } from "@/components/Button";
import { useTranslation } from "react-i18next";
import { useIsModerator } from "@/util/useIsAdmin";
import { useAsyncButton } from "@/util/use-async-button";

interface Props {
  reports: ReportPageDto;
  page: number;
}

export default function AdminReportsPage({ reports, page }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const isModerator = useIsModerator();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const unhandledOnPage = reports.data.filter((r) => !r.handled);
  const allOnPageSelected =
    unhandledOnPage.length > 0 &&
    unhandledOnPage.every((r) => selected.has(r.id));
  const toggleSelectAllOnPage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        unhandledOnPage.forEach((r) => next.delete(r.id));
      } else {
        unhandledOnPage.forEach((r) => next.add(r.id));
      }
      return next;
    });

  const [olderThanDays, setOlderThanDays] = useState(30);
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  const refresh = async () => {
    setSelected(new Set());
    setPreviewCount(null);
    await router.replace(router.asPath);
  };

  const [isAcceptingSelected, acceptSelected] = useAsyncButton(async () => {
    if (selected.size === 0) return;
    await getApi().reportBulk.bulkHandleReports({
      ids: Array.from(selected),
      valid: true,
    });
    await refresh();
  }, [selected]);

  const [isRejectingSelected, rejectSelected] = useAsyncButton(async () => {
    if (selected.size === 0) return;
    await getApi().reportBulk.bulkHandleReports({
      ids: Array.from(selected),
      valid: false,
    });
    await refresh();
  }, [selected]);

  const [isPreviewing, previewOld] = useAsyncButton(async () => {
    const count = await getApi().reportBulk.previewBulkHandle(olderThanDays);
    setPreviewCount(count);
  }, [olderThanDays]);

  const [isRejectingOld, rejectOld] = useAsyncButton(async () => {
    if (
      !window.confirm(
        `Отклонить все необработанные жалобы старше ${olderThanDays} дней? Это действие нельзя отменить.`,
      )
    ) {
      return;
    }
    await getApi().reportBulk.bulkHandleReports({
      olderThanDays,
      valid: false,
    });
    await refresh();
  }, [olderThanDays]);

  const isBusy =
    isAcceptingSelected || isRejectingSelected || isPreviewing || isRejectingOld;

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
      {isModerator && (
        <Table className="very-compact">
          <tbody>
            <tr>
              <td>Выбрано жалоб: {selected.size}</td>
              <td>
                <Button disabled={isBusy || selected.size === 0} onClick={acceptSelected}>
                  Принять выбранные
                </Button>{" "}
                <Button disabled={isBusy || selected.size === 0} onClick={rejectSelected}>
                  Отклонить выбранные
                </Button>
              </td>
            </tr>
            <tr>
              <td>
                Быстрая очистка старых:{" "}
                <input
                  type="number"
                  min={1}
                  value={olderThanDays}
                  onChange={(e) =>
                    setOlderThanDays(Math.max(1, Number(e.target.value) || 1))
                  }
                  style={{ width: 64 }}
                />{" "}
                дней
              </td>
              <td>
                <Button disabled={isBusy} onClick={previewOld}>
                  Проверить количество
                </Button>{" "}
                {previewCount !== null && (
                  <span>Найдено: {previewCount}. </span>
                )}
                <Button disabled={isBusy} onClick={rejectOld}>
                  Отклонить все старше {olderThanDays} дней
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      )}
      <Table className="very-compact">
        <thead>
          <tr>
            {isModerator && (
              <th>
                <Checkbox
                  checked={allOnPageSelected}
                  onChange={toggleSelectAllOnPage}
                />
              </th>
            )}
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
              {isModerator && (
                <td>
                  <Checkbox
                    disabled={report.handled}
                    checked={selected.has(report.id)}
                    onChange={() => toggleSelected(report.id)}
                  />
                </td>
              )}
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
