import {
  Duration,
  EmbedProps,
  GenericTable,
  Pagination,
  Panel,
  SelectOptions,
} from "@/components";
import { getApi } from "@/api/hooks";
import { GameSeasonDto, LeaderboardEntryPageDto } from "@/api/back";
import { colors } from "@/colors";
import cx from "clsx";
import { numberOrDefault } from "@/util/urls";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { ColumnType } from "@/const/tables";
import { useRouter } from "next/router";

interface LeaderboardPageProps {
  initialLeaderboard: LeaderboardEntryPageDto;
  seasons: GameSeasonDto[];
  selectedSeasonId?: number;
}

export default function LeaderboardPage({
  initialLeaderboard,
  seasons,
  selectedSeasonId,
}: LeaderboardPageProps) {
  const seasonOptions = seasons.map((season) => ({
    value: season.id,
    label: `Сезон ${season.id}`,
  }));
  const router = useRouter();
  return (
    <>
      <EmbedProps
        title={"Игроки"}
        description={
          "Таблица лидеров игроков сайта dotaclassic.ru, лучшие игроки и их статистика"
        }
      />

      <Panel>
        <SelectOptions
          options={seasonOptions}
          selected={selectedSeasonId}
          onSelect={({ value }) => {
            const link = AppRouter.players.leaderboard(0, value).link;
            router.push(link.href, link.as);
          }}
          defaultText={"Сезон"}
        />
      </Panel>

      <Pagination
        page={initialLeaderboard.page}
        maxPage={initialLeaderboard.pages}
        linkProducer={(pg) =>
          AppRouter.players.leaderboard(pg, selectedSeasonId).link
        }
      />
      <GenericTable
        placeholderRows={100}
        keyProvider={(it) => it[1].steamId}
        isLoading={false}
        columns={[
          {
            type: ColumnType.Raw,
            name: "Ранг",
            mobileOmit: true,
            format: (d) => (
              <div
                style={{
                  fontSize: "1.1rem",
                  textAlign: "center",
                  margin: "auto",
                }}
                className={cx({
                  gold: d == 1,
                  silver: d == 2,
                  bronze: d == 3,
                  shit: d > 3,
                })}
              >
                {d || "-"}
              </div>
            ),
          },
          {
            type: ColumnType.Player,
            name: "Игрок",
          },
          {
            type: ColumnType.IntWithBar,
            name: "Рейтинг",
            color: colors.gold,
            format: (d) => d || "-",
          },
          {
            type: ColumnType.IntWithBar,
            name: "Матчи",
          },
          {
            type: ColumnType.IntWithBar,
            name: "Победы",
            color: colors.green,
            mobileOmit: true,
          },
          {
            type: ColumnType.PercentWithBar,
            name: "% Побед",
            color: colors.green,
          },
          {
            type: ColumnType.KDA,
            name: "KDA",
            mobileOmit: true,
          },
          {
            type: ColumnType.IntWithBar,
            name: "Игровое время",
            color: colors.grey,
            mobileOmit: true,
            format: (d) => <Duration big duration={d} />,
          },
        ]}
        data={initialLeaderboard.data.map((it) => [
          it.rank,
          it.user,
          it.mmr,
          it.games,
          it.wins,
          (it.wins / it.games) * 100,
          { kills: it.kills, deaths: it.deaths, assists: it.assists },
          it.playTime,
        ])}
      />
      <Pagination
        page={initialLeaderboard.page}
        maxPage={initialLeaderboard.pages}
        linkProducer={(pg) =>
          AppRouter.players.leaderboard(pg, selectedSeasonId).link
        }
      />
    </>
  );
}

LeaderboardPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<LeaderboardPageProps> => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  const seasonId = numberOrDefault(ctx.query.seasonId as string, 0);

  const [initialLeaderboard, seasons] = await Promise.combine([
    getApi().playerApi.playerControllerLeaderboard(
      page,
      100,
      seasonId || undefined,
    ),
    getApi().statsApi.statsControllerGetGameSeasons(),
  ]);
  return {
    initialLeaderboard,
    seasons,
    selectedSeasonId: seasonId || seasons.find((t) => t.isActive)?.id,
  };
};
