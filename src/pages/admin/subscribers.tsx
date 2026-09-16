import React, { useMemo, useState } from "react";
import { NextPageContext } from "next";
import { useTranslation } from "react-i18next";

import { getApi } from "@/api/hooks";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { UserRoleSummaryDto } from "@/api/back";
import { Role } from "@/api/mapped-models";
import { RoleNames } from "@/const/roles";
import { AppRouter } from "@/route";
import { EmbedProps } from "@/components/EmbedProps";
import { Section } from "@/components/Section";
import { Table } from "@/components/Table";
import { TimeAgo } from "@/components/TimeAgo";
import { PageLink } from "@/components/PageLink";
import { Checkbox } from "@/components/Checkbox";

interface Props {
  summaries: UserRoleSummaryDto[];
}

// The paid store subscription grants the OLD role; the others are staff
// roles that happen to live in the same role-lifetime table.
const SUBSCRIPTION_ROLE = Role.OLD;

interface SubscriberRow {
  steamId: string;
  name: string;
  role: Role;
  endsAt: number;
}

// end_time is typed as a plain number and the services are not consistent
// about the unit, so normalize seconds to milliseconds.
const toMillis = (endTime: number): number =>
  endTime < 1e12 ? endTime * 1000 : endTime;

const flatten = (summaries: UserRoleSummaryDto[]): SubscriberRow[] =>
  summaries.flatMap((summary) =>
    summary.entries.map((entry) => ({
      steamId: summary.steamId,
      name: summary.name,
      role: entry.role as Role,
      endsAt: toMillis(entry.endTime),
    })),
  );

export default function AdminSubscribersPage({ summaries }: Props) {
  const { t } = useTranslation();
  const [showExpired, setShowExpired] = useState(false);
  const [showStaff, setShowStaff] = useState(false);

  const { data } = getApi().adminApi.useAdminUserControllerListRoles({
    fallbackData: summaries,
    refreshInterval: 60000,
  });

  const all = useMemo(() => flatten(data || summaries), [data, summaries]);

  const rows = useMemo(() => {
    const now = Date.now();
    return all
      .filter((row) => showStaff || row.role === SUBSCRIPTION_ROLE)
      .filter((row) => showExpired || row.endsAt > now)
      .sort((a, b) => a.endsAt - b.endsAt);
  }, [all, showExpired, showStaff]);

  const activeCount = useMemo(() => {
    const now = Date.now();
    return all.filter(
      (row) => row.role === SUBSCRIPTION_ROLE && row.endsAt > now,
    ).length;
  }, [all]);

  const now = Date.now();

  return (
    <>
      <EmbedProps
        title={t("admin_subscribers.seo.title")}
        description={t("admin_subscribers.seo.description")}
      />
      <Section>
        <header>
          {t("admin_subscribers.activeCount", { count: activeCount })}
        </header>
        <Checkbox checked={showExpired} onChange={setShowExpired}>
          {t("admin_subscribers.showExpired")}
        </Checkbox>
        <Checkbox checked={showStaff} onChange={setShowStaff}>
          {t("admin_subscribers.showStaff")}
        </Checkbox>
      </Section>
      <Table className="very-compact">
        <thead>
          <tr>
            <th>{t("admin_subscribers.player")}</th>
            <th>{t("admin_subscribers.role")}</th>
            <th>{t("admin_subscribers.expires")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.steamId}_${row.role}_${row.endsAt}`}>
              <td>
                <PageLink
                  className="link"
                  link={AppRouter.players.player.index(row.steamId).link}
                >
                  {row.name}
                </PageLink>
              </td>
              <td>{RoleNames[row.role] || row.role}</td>
              <td>
                <TimeAgo date={row.endsAt} />
                {row.endsAt <= now && <> ({t("admin_subscribers.expired")})</>}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3}>{t("admin_subscribers.empty")}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

AdminSubscribersPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => ({
  summaries: await withTemporaryToken(ctx, () =>
    getApi().adminApi.adminUserControllerListRoles(),
  ),
});
