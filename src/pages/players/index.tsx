import Head from "next/head";
import { Duration, GenericTable } from "@/components";
import { useApi } from "@/api/hooks";
import { LeaderboardEntryDto } from "@/api/back";
import { useDidMount } from "@/util/hooks";
import { ColumnType } from "@/components/GenericTable/GenericTable";
import { colors } from "@/colors";
import cx from "classnames";

interface Props {
  initialLeaderboard: LeaderboardEntryDto[];
}

export default function Leaderboard({ initialLeaderboard }: Props) {
  const mounted = useDidMount();

  const { data, isLoading } = useApi().playerApi.usePlayerControllerLeaderboard(
    undefined,
    {
      fallbackData: initialLeaderboard,
      isPaused() {
        return !mounted;
      },
    },
  );

  return (
    <>
      <Head>
        <title>Таблица лидеров</title>
      </Head>

      <GenericTable
        placeholderRows={100}
        keyProvider={(it) => it[0]}
        isLoading={isLoading}
        columns={[
          {
            type: ColumnType.Raw,
            name: "Ранк",
            format: (d) => (
              <div
                style={{ fontSize: "1.4rem", width: 10, margin: "auto" }}
                className={cx({
                  gold: d == 1,
                  silver: d == 2,
                  bronze: d == 3,
                  shit: d > 3,
                })}
              >
                {d}
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
        data={data!.map((it) => [
          it.rank + 1,
          { steam_id: it.steamId, avatar: it.avatar, name: it.name },
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

Leaderboard.getInitialProps = async (ctx) => {
  return {
    initialLeaderboard: await useApi().playerApi.playerControllerLeaderboard(),
  };
};
