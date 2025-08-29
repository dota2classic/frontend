import { NextPageContext } from "next";
import { numberOrDefault } from "@/util/urls";
import { PunishmentLogPageDto, RuleType, UserDTO } from "@/api/back";
import { getApi } from "@/api/hooks";
import {
  Checkbox,
  Duration,
  EmbedProps,
  PageLink,
  Pagination,
  Panel,
  Table,
  TimeAgo,
  UserPicker,
  UserPreview,
} from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { useQueryBackedParameter } from "@/util";
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

interface Props {
  page: PunishmentLogPageDto;
  chosenUser?: UserDTO;
}
const BanLog = observer(function BanLog({ page, chosenUser }: Props) {
  const [, setSteamId] = useQueryBackedParameter("steamId");
  const { auth } = useStore();
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("banlog_page.seo.title")}
        description={t("banlog_page.seo.description")}
      />
      <Panel
        style={{ flexDirection: "row", alignItems: "center" }}
        className={"nicerow"}
      >
        {auth.isModerator ? (
          <>
            <UserPicker
              value={chosenUser}
              onSelect={(it) => {
                setSteamId(it?.steamId);
              }}
            />
          </>
        ) : (
          auth.isAuthorized && (
            <Checkbox
              checked={chosenUser?.steamId === auth?.parsedToken?.sub}
              onChange={(e) => {
                if (e) {
                  setSteamId(auth.parsedToken?.sub);
                } else {
                  setSteamId(undefined);
                }
              }}
            >
              {t("banlog_page.onlyMine")}
            </Checkbox>
          )
        )}
      </Panel>
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.banLog.index(pg).link}
      />
      <Table>
        <thead>
          <tr>
            <th>{t("banlog_page.dateOfPunishment")}</th>
            <th>{t("banlog_page.durationOfBan")}</th>
            <th>{t("banlog_page.rule")}</th>
            <th>{t("banlog_page.complaint")}</th>
            <th>{t("banlog_page.violator")}</th>
            <th>{t("banlog_page.executor")}</th>
          </tr>
        </thead>
        <tbody>
          {page.data.map((log) => (
            <tr key={log.id}>
              <td>
                <TimeAgo date={log.createdAt} />
              </td>
              <td>
                <div>
                  {log.rule.ruleType === RuleType.GAMEPLAY
                    ? t("banlog_page.gameplayBan")
                    : t("banlog_page.communicationBan")}
                  {": "}
                </div>

                <div className="red">
                  {log.duration > 60 * 60 * 24 * 1000 ? (
                    t("banlog_page.permaBan")
                  ) : (
                    <Duration duration={log.duration} long />
                  )}
                </div>
              </td>
              <td>
                <PageLink link={AppRouter.rules2.rule(log.rule.id).link}>
                  {log.rule.title}
                </PageLink>
              </td>
              <td>
                {log.reportId ? (
                  <PageLink
                    link={AppRouter.forum.report.report(log.reportId).link}
                  >
                    {t("banlog_page.withComplaint")}
                  </PageLink>
                ) : (
                  <span>{t("banlog_page.withoutComplaint")}</span>
                )}
              </td>
              <td>
                <UserPreview user={log.reported} />
              </td>
              <td>
                <UserPreview user={log.executor} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
});

export default BanLog;

// @ts-ignore
BanLog.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  const steamId = ctx.query.steamId as string;

  return {
    page: await getApi().report.reportControllerGetPaginationLog(
      page,
      20,
      steamId,
    ),
    chosenUser: steamId
      ? await getApi()
          .playerApi.playerControllerPlayerSummary(steamId)
          .then((t) => t.user)
      : undefined,
  };
};
