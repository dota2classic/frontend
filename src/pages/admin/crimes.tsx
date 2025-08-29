import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { BanReason, CrimeLogPageDto, MatchmakingMode } from "@/api/back";
import { numberOrDefault } from "@/util/urls";
import {
  Button,
  Duration,
  EmbedProps,
  GenericTable,
  InvitePlayerModalRaw,
  PageLink,
  Pagination,
  Panel,
  TimeAgo,
} from "@/components";
import React, { useCallback, useState } from "react";
import { AppRouter } from "@/route";
import { formatBanReason } from "@/util/texts/bans";
import { ColumnType } from "@/const/tables";
import c from "./AdminStyles.module.scss";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface Props {
  crime: CrimeLogPageDto;
  page: number;
  steamId?: string;
}

export default function CrimesPage({ crime, steamId }: Props) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const close = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);
  const open = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]);
  return (
    <>
      <EmbedProps
        title={t("crimes_page.seo.title")}
        description={t("crimes_page.seo.description")}
        noindex
      />
      {modalOpen &&
        createPortal(
          <InvitePlayerModalRaw
            close={close}
            onSelect={(user) => {
              AppRouter.admin.crimes(0, user.steamId).open();
              close();
            }}
          />,
          document.body,
        )}
      <Panel>
        <Button onClick={open}>{t("crimes_page.filterByPlayer")}</Button>
        <Button
          disabled={!steamId}
          onClick={() => AppRouter.admin.crimes(0).open()}
        >
          {t("crimes_page.resetPlayerFilter")}
        </Button>
      </Panel>
      <Pagination
        page={crime.page}
        maxPage={crime.pages}
        linkProducer={(pg) => AppRouter.admin.crimes(pg).link}
      />
      <GenericTable
        keyProvider={(it) => it[8]}
        columns={[
          {
            type: ColumnType.Player,
            name: t("crimes_page.player"),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.match"),
            format: (matchId?: number) =>
              matchId ? (
                <PageLink
                  className={c.nowrap}
                  link={AppRouter.matches.match(matchId).link}
                >
                  {t("crimes_page.matchId", { matchId })}
                </PageLink>
              ) : (
                <span className={c.nowrap}>{t("crimes_page.outOfMatch")}</span>
              ),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.comment"),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.banDuration"),
            format: (t: number) => <Duration duration={t} />,
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.violation"),
            format: (t: BanReason) => (
              <span className={c.nowrap}>{formatBanReason(t)}</span>
            ),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.gameMode"),
            format: (mode: MatchmakingMode) => (
              <span className={c.nowrap}>{t(`matchmaking_mode.${mode}`)}</span>
            ),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.date"),
            format: (t) => (
              <span className={c.nowrap}>
                <TimeAgo date={t} />
              </span>
            ),
          },
          {
            type: ColumnType.Raw,
            name: t("crimes_page.processed"),
            format: (t) => <input type="checkbox" readOnly checked={t} />,
          },
        ]}
        data={crime.data.map((crimeLog) => [
          crimeLog.user,
          crimeLog.matchId,
          crimeLog.lobbyType === MatchmakingMode.BOTS
            ? t("crimes_page.botsGame")
            : t("crimes_page.counted"),
          crimeLog.banDuration / 1000,
          crimeLog.crime,
          crimeLog.lobbyType,
          crimeLog.createdAt,
          crimeLog.handled,
          crimeLog.id,
        ])}
        placeholderRows={5}
      />
      <Pagination
        page={crime.page}
        maxPage={crime.pages}
        linkProducer={(pg) => AppRouter.admin.crimes(pg).link}
      />
    </>
  );
}

CrimesPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  const steamId = ctx.query.steam_id as string | undefined;

  return {
    crime: await withTemporaryToken(ctx, () =>
      getApi().adminApi.adminUserControllerCrimes(page, undefined, steamId),
    ),
    page,
    steamId,
  };
};
