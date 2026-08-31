import { getApi } from "@/api/hooks";
import { GameSeasonDto, UserDTO } from "@/api/back";
import { LeaderboardSort } from "@/api/customPlayerApi";
import { colors } from "@/colors";
import cx from "clsx";
import { numberOrDefault } from "@/util/urls";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import React from "react";
import { ColumnType } from "@/const/tables";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { SelectOptions } from "@/components/SelectOptions";
import { Pagination } from "@/components/Pagination";
import { GenericTable } from "@/components/GenericTable";
import { Duration } from "@/components/Duration";
import { Surface } from "@/components/Surface";

interface LeaderboardEntryWithStats {
  user: UserDTO;
  id: string;
  mmr?: number;
  rank?: number;
  games: number;
  wins: number;
  abandons: number;
  kills: number;
  deaths: number;
  assists: number;
  playTime: number;
  winrate: number;
  kda: number;
}

interface LeaderboardEntryPageWithStats {
  data: LeaderboardEntryWithStats[];
  page: number;
  perPage: number;
  pages: number;
}

interface LeaderboardPageProps {
  initialLeaderboard: LeaderboardEntryPageWithStats;
  seasons: GameSeasonDto[];
  selectedSeasonId?: number;
  sort?: LeaderboardSort;
  sortDir: "ASC" | "DESC";
}

const SORT_OPTIONS: { value: LeaderboardSort | ""; label: string }[] = [
  { value: "", label: "Рейтинг" },
  { value: "winrate", label: "Винрейт" },
  { value: "kda", label: "KDA" },
  { value: "games", label: "Матчи" },
  { value: "wins", label: "Победы" },
  { value: "playtime", label: "Время в игре" },
  { value: "abandons", label: "Ливы" },
];

export default function LeaderboardPage({
  initialLeaderboard,
  seasons,
  selectedSeasonId,
  sort,
  sortDir,
}: LeaderboardPageProps) {
  const { t } = useTranslation();
  const seasonOptions = seasons.map((season) => ({
    value: season.id,
    label: `${t("leaderboard_page.season")} ${season.id}`,
  }));
  const router = useRouter();
  return (
    <>
      <EmbedProps
        title={t("leaderboard_page.seo.title")}
        description={t("leaderboard_page.seo.description")}
      />
      <Surface className="horizontal" padding="xs" variant="panel">
        <SelectOptions
          options={seasonOptions}
          selected={selectedSeasonId}
          onSelect={({ value }) => {
            const link = AppRouter.players.leaderboard(
              0,
              value,
              sort,
              sortDir,
            ).link;
            router.push(link.href, link.as);
          }}
          defaultText={t("leaderboard_page.seasonSelect")}
        />
        <SelectOptions
          options={SORT_OPTIONS}
          selected={sort || ""}
          onSelect={({ value }) => {
            const link = AppRouter.players.leaderboard(
              0,
              selectedSeasonId,
              value || undefined,
              sortDir,
            ).link;
            router.push(link.href, link.as);
          }}
          defaultText="Сортировка"
        />
      </Surface>

      <Pagination
        page={initialLeaderboard.page}
        maxPage={initialLeaderboard.pages}
        linkProducer={(pg) =>
          AppRouter.players.leaderboard(pg, selectedSeasonId, sort, sortDir)
            .link
        }
      />
      <GenericTable
        placeholderRows={100}
        keyProvider={(it) => it[1].steamId}
        isLoading={false}
        columns={[
          {
            type: ColumnType.Raw,
            name: t("leaderboard_page.rank"),
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
            name: t("leaderboard_page.player"),
          },
          {
            type: ColumnType.IntWithBar,
            name: t("leaderboard_page.rating"),
            color: colors.gold,
            format: (d) => d || "-",
          },
          {
            type: ColumnType.IntWithBar,
            name: t("leaderboard_page.matches"),
          },
          {
            type: ColumnType.IntWithBar,
            name: t("leaderboard_page.wins"),
            color: colors.green,
            mobileOmit: true,
          },
          {
            type: ColumnType.PercentWithBar,
            name: t("leaderboard_page.winRate"),
            color: colors.green,
          },
          {
            type: ColumnType.KDA,
            name: t("leaderboard_page.kda"),
            mobileOmit: true,
          },
          {
            type: ColumnType.IntWithBar,
            name: t("leaderboard_page.playTime"),
            color: colors.grey,
            mobileOmit: true,
            format: (d) => <Duration duration={d} />,
          },
          {
            type: ColumnType.IntWithBar,
            name: t("leaderboard_page.abandons"),
            mobileOmit: true,
            color: colors.bronze,
          },
        ]}
        data={initialLeaderboard.data.map((it) => [
          it.rank,
          it.user,
          it.mmr,
          it.games,
          it.wins,
          it.winrate * 100,
          { kills: it.kills, deaths: it.deaths, assists: it.assists },
          it.playTime,
          it.abandons,
        ])}
      />
      <Pagination
        page={initialLeaderboard.page}
        maxPage={initialLeaderboard.pages}
        linkProducer={(pg) =>
          AppRouter.players.leaderboard(pg, selectedSeasonId, sort, sortDir)
            .link
        }
      />
    </>
  );
}

const isLeaderboardSort = (v: unknown): v is LeaderboardSort =>
  v === "mmr" ||
  v === "games" ||
  v === "wins" ||
  v === "winrate" ||
  v === "kda" ||
  v === "playtime" ||
  v === "abandons";

LeaderboardPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<LeaderboardPageProps> => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  const seasonId = numberOrDefault(ctx.query.seasonId as string, 0);
  const sortParam = ctx.query.sort as string | undefined;
  const sort = isLeaderboardSort(sortParam) ? sortParam : undefined;
  const sortDir: "ASC" | "DESC" = ctx.query.sortDir === "ASC" ? "ASC" : "DESC";

  const [initialLeaderboard, seasons] = await Promise.combine([
    getApi().playerLeaderboard.leaderboardSorted(
      page,
      100,
      seasonId || undefined,
      sort,
      sort ? sortDir : undefined,
    ),
    getApi().statsApi.statsControllerGetGameSeasons(),
  ]);
  return {
    initialLeaderboard,
    seasons,
    selectedSeasonId: seasonId || seasons.find((t) => t.isActive)?.id,
    sort,
    sortDir,
  };
};
