import { useQueryBackedParameter, useRouterChanging } from "@/util/hooks";
import Head from "next/head";
import { NextPageContext } from "next";
import { useApi } from "@/api/hooks";
import { MatchPageDto, PlayerSummaryDto } from "@/api/back";
import {
  Pagination,
  Panel,
  PlayerMatchTable,
  PlayerSummary,
  SelectOptions,
} from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import c from "@/pages/stats/History.module.scss";
import {
  GameModeOptions,
  HeroOptions,
} from "@/components/SelectOptions/SelectOptions";
import { numberOrDefault } from "@/util/urls";
import { fullName, shortName } from "@/util/heroName";
import { matchToPlayerMatchItem } from "@/util/mappers";

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

  const formattedMatches = (data?.data || []).map((it) =>
    matchToPlayerMatchItem(it, (it) => it.steamId === playerId),
  );

  return (
    <>
      <Head>
        <title>{preloadedSummary.name}</title>
      </Head>

      <PlayerSummary
        image={preloadedSummary.avatar || "/avatar.png"}
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rating={preloadedSummary.mmr}
        name={preloadedSummary.name}
        className={c.panel}
        steamId={preloadedSummary.steamId}
      />

      <Panel className={c.filters}>
        <SelectOptions
          options={GameModeOptions}
          selected={mode === undefined ? "undefined" : mode}
          onSelect={(value) => {
            if (value === "undefined") setMode(undefined);
            else setMode(value);
          }}
          defaultText={"Режим игры"}
        />
        <SelectOptions
          options={HeroOptions}
          selected={hero === undefined ? "undefined" : fullName(hero)}
          onSelect={(value) => {
            if (value === "undefined") setHero(undefined);
            else setHero(shortName(value));
          }}
          defaultText={"Герой"}
        />
      </Panel>
      <div>
        <PlayerMatchTable
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
      </div>
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

  const [preloadedSummary, initialMatches] = await Promise.all<any>([
    useApi().playerApi.playerControllerPlayerSummary(playerId),
    useApi().matchApi.matchControllerPlayerMatches(
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
