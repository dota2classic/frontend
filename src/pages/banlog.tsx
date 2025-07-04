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

interface Props {
  page: PunishmentLogPageDto;
  chosenUser?: UserDTO;
}
const BanLog = observer(function BanLog({ page, chosenUser }: Props) {
  const [, setSteamId] = useQueryBackedParameter("steamId");
  const { auth } = useStore();
  return (
    <>
      <EmbedProps
        title={"Журнал нарушений"}
        description={"Журнал нарушений правил на сайте dotaclassic.ru "}
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
              Только мои
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
            <th>Дата наказания</th>
            <th>Длительность бана</th>
            <th>Правило</th>
            <th>Жалоба</th>
            <th>Нарушитель</th>
            <th>Исполнитель</th>
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
                    ? "Бан поиска"
                    : "Бан коммуникаций"}
                  {": "}
                </div>

                <div className="red">
                  {log.duration > 60 * 60 * 24 * 1000 ? (
                    "Пермабан"
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
                    С жалобой
                  </PageLink>
                ) : (
                  <span>Без жалобы</span>
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
