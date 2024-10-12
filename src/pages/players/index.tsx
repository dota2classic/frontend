import Head from "next/head";
import { Duration, GenericTable } from "@/components";
import { useApi } from "@/api/hooks";
import { LeaderboardEntryDto } from "@/api/back";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";
import cx from "classnames";
import { NextPageContext } from "next";

interface LeaderboardPageProps {
  initialLeaderboard: LeaderboardEntryDto[];
}

export default function LeaderboardPage({
  initialLeaderboard,
}: LeaderboardPageProps) {
  return (
    <>
      <Head>
        <title>Таблица лидеров</title>
      </Head>

      <GenericTable
        placeholderRows={100}
        keyProvider={(it) => it[1].steam_id}
        isLoading={false}
        columns={[
          {
            type: ColumnType.Raw,
            name: "Ранг",
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
          },
          {
            type: ColumnType.PercentWithBar,
            name: "% Побед",
            color: colors.green,
          },
          {
            type: ColumnType.KDA,
            name: "KDA",
          },
          {
            type: ColumnType.IntWithBar,
            name: "Игровое время",
            color: colors.grey,
            format: (d) => <Duration big duration={d} />,
          },
        ]}
        data={initialLeaderboard.map((it) => [
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
    </>
  );
}

LeaderboardPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<LeaderboardPageProps> => {
  return {
    initialLeaderboard: await useApi().playerApi.playerControllerLeaderboard(),
  };
};
