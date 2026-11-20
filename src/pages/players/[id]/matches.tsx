import { useClampedPage } from "@/util/useClampedPage";
import { useQueryBackedParameter } from "@/util/useQueryBackedParameter";
import { useRouterChanging } from "@/util/useRouterChanging";
import { MatchPageDto, PlayerSummaryDto } from "@/api/back";
import { AppRouter } from "@/route";
import React from "react";
import c from "@/pages/matches/History.module.scss";
import pc from "@/pages/players/[id]/PlayerPage.module.scss";
import { numberOrDefault, parsePage } from "@/util/urls";
import { fullName, shortName } from "@/util/heroName";
import { matchToPlayerMatchItem } from "@/util/mappers";
import { NextPageContext } from "next";
import { MatchComparator } from "@/util/sorts";
import { HeroOptions, useGameModeOptions } from "@/const/options";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { SelectOptions } from "@/components/SelectOptions";
import { Pagination } from "@/components/Pagination";
import { Section } from "@/components/Section";
import { HeroWithItemsHistoryTable } from "@/components/HeroWithItemsHistoryTable";
import { PlayerSummary } from "@/components/PlayerSummary";
import { Surface } from "@/components/Surface";
import { loadPlayerPage } from "@/util/load-player-page";

interface Props {
  playerId: string;
  preloadedSummary: PlayerSummaryDto;
  initialMatches: MatchPageDto;
}

export default function PlayerMatches({
  preloadedSummary,
  playerId,
  initialMatches,
}: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useQueryBackedParameter("page");
  const [hero, setHero] = useQueryBackedParameter("hero");
  const [mode, setMode] = useQueryBackedParameter("mode");

  const gameModeOptions = useGameModeOptions();

  const [isLoading] = useRouterChanging();

  const data = initialMatches;

  useClampedPage(page, data?.pages, setPage);

  const formattedMatches = (data?.data || [])
    .sort(MatchComparator)
    .map((it) =>
      matchToPlayerMatchItem(it, (it) => it.user.steamId === playerId),
    );

  return (
    <div className={pc.playerPage}>
      <EmbedProps
        title={t("player_matches.historyTitle", {
          name: preloadedSummary.user.name,
        })}
        description={t("player_matches.historyDescription", {
          name: preloadedSummary.user.name,
        })}
      />

      <PlayerSummary
        session={preloadedSummary.session}
        banStatus={preloadedSummary.banStatus}
        stats={preloadedSummary.overallStats}
        user={preloadedSummary.user}
        rank={preloadedSummary.seasonStats.rank}
        mmr={preloadedSummary.seasonStats.mmr}
      />

      <Section className={pc.fullwidth}>
        <Surface className={c.filters} padding="xs" variant="panel">
          <SelectOptions
            options={gameModeOptions}
            selected={mode}
            onSelect={({ value }) => {
              if (value === "undefined") setMode(undefined);
              else setMode(value);
            }}
            defaultText={t("player_matches.gameMode")}
          />
          <SelectOptions
            options={HeroOptions}
            selected={hero === undefined ? "undefined" : fullName(hero)}
            onSelect={({ value }) => {
              if (value === "undefined") setHero(undefined);
              else setHero(shortName(value));
            }}
            defaultText={t("player_matches.hero")}
          />
        </Surface>
        <Pagination
          linkProducer={(page) =>
            AppRouter.players.playerMatches(
              playerId,
              hero,
              page,
              numberOrDefault(mode, undefined),
            ).link
          }
          page={parsePage(page)}
          maxPage={data?.pages || 0}
        />
        <HeroWithItemsHistoryTable
          withItems
          loading={isLoading}
          data={formattedMatches}
        />
        <Pagination
          linkProducer={(page) =>
            AppRouter.players.playerMatches(
              playerId,
              hero,
              page,
              numberOrDefault(mode, undefined),
            ).link
          }
          page={parsePage(page)}
          maxPage={data?.pages || 0}
        />
      </Section>
    </div>
  );
}

PlayerMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  let hero = ctx.query.hero as string;
  hero = hero && fullName(hero);

  const page = parsePage(ctx.query.page);
  const mode = numberOrDefault(ctx.query.mode, undefined);

  const {
    playerId,
    summary: preloadedSummary,
    data: [initialMatches],
  } = await loadPlayerPage(ctx, (api, playerId) => [
    api.matchApi.matchControllerPlayerMatches(
      playerId,
      page,
      undefined,
      numberOrDefault(mode, undefined),
      hero,
    ),
  ]);

  return {
    playerId,
    preloadedSummary,
    initialMatches,
  };
};
