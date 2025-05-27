import {
  useClampedPage,
  useQueryBackedParameter,
  useRouterChanging,
} from "@/util";
import { getApi } from "@/api/hooks";
import { MatchPageDto, PlayerSummaryDto } from "@/api/back";
import {
  EmbedProps,
  HeroWithItemsHistoryTable,
  Pagination,
  Panel,
  PlayerSummary,
  Section,
  SelectOptions,
} from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import c from "@/pages/matches/History.module.scss";
import { numberOrDefault } from "@/util/urls";
import { fullName, shortName } from "@/util/heroName";
import { matchToPlayerMatchItem } from "@/util/mappers";
import { NextPageContext } from "next";
import { MatchComparator } from "@/util/sorts";
import { GameModeOptions, HeroOptions } from "@/const/options";

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
  const [page, setPage] = useQueryBackedParameter("page");
  const [hero, setHero] = useQueryBackedParameter("hero");
  const [mode, setMode] = useQueryBackedParameter("mode");

  const [isLoading] = useRouterChanging();

  const data = initialMatches;

  useClampedPage(page, data?.pages, setPage);

  const formattedMatches = (data?.data || [])
    .sort(MatchComparator)
    .map((it) =>
      matchToPlayerMatchItem(it, (it) => it.user.steamId === playerId),
    );

  return (
    <>
      <EmbedProps
        title={`${preloadedSummary.user.name} история матчей`}
        description={`История матчей игрока ${preloadedSummary.user.name}. Список игр сыгранных в старую доту`}
      />

      <PlayerSummary
        banStatus={preloadedSummary.banStatus}
        stats={preloadedSummary.overallStats}
        user={preloadedSummary.user}
        rank={preloadedSummary.seasonStats.rank}
        mmr={preloadedSummary.seasonStats.mmr}
      />

      <Section>
        <Panel className={c.filters}>
          <SelectOptions
            options={GameModeOptions}
            selected={mode}
            onSelect={({ value }) => {
              if (value === "undefined") setMode(undefined);
              else setMode(value);
            }}
            defaultText={"Режим игры"}
          />
          <SelectOptions
            options={HeroOptions}
            selected={hero === undefined ? "undefined" : fullName(hero)}
            onSelect={({ value }) => {
              if (value === "undefined") setHero(undefined);
              else setHero(shortName(value));
            }}
            defaultText={"Герой"}
          />
        </Panel>
        <Pagination
          linkProducer={(page) =>
            AppRouter.players.playerMatches(
              playerId,
              hero,
              page,
              numberOrDefault(mode, undefined),
            ).link
          }
          page={Number(page) || data?.page || 0}
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
          page={Number(page) || data?.page || 0}
          maxPage={data?.pages || 0}
        />
      </Section>
    </>
  );
}

PlayerMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;
  let hero = ctx.query.hero as string;
  hero = hero && fullName(hero);

  const page = numberOrDefault(ctx.query.page, 0);
  const mode = numberOrDefault(ctx.query.mode, undefined);

  const [preloadedSummary, initialMatches] = await Promise.combine<
    PlayerSummaryDto,
    MatchPageDto
  >([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().matchApi.matchControllerPlayerMatches(
      playerId,
      numberOrDefault(page, 0),
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
