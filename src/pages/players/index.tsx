import { Duration, EmbedProps, GenericTable, Pagination } from "@/components";
import { getApi } from "@/api/hooks";
import { LeaderboardEntryPageDto } from "@/api/back";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";
import cx from "classnames";
import { numberOrDefault } from "@/util/urls";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";

interface LeaderboardPageProps {
  initialLeaderboard: LeaderboardEntryPageDto;
}

export default function LeaderboardPage({
  initialLeaderboard,
}: LeaderboardPageProps) {
  return (
    <>
      <EmbedProps
        title={"Игроки"}
        description={
          "Таблица лидеров игроков сайта dotaclassic.ru, лучшие игроки и их статистика"
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
        linkProducer={(pg) => AppRouter.players.leaderboard(pg).link}
      />
    </>
  );
}

LeaderboardPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<LeaderboardPageProps> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  return {
    initialLeaderboard: await getApi().playerApi.playerControllerLeaderboard(
      page,
      100,
    ),
  };
};
