import { MatchHistoryTable, Pagination, SelectOptions } from "@/components";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { MatchPageDto } from "@/api/back";
import c from "./History.module.scss";
import { AppRouter } from "@/route";
import { useQueryBackedParameter, useRouterChanging } from "@/util/hooks";
import React, { useEffect } from "react";
import { numberOrDefault } from "@/util/urls";
import Head from "next/head";
import { GameModeOptions } from "@/components/SelectOptions/SelectOptions";
import { MatchmakingMode } from "@/const/enums";

interface MatchHistoryProps {
  matches: MatchPageDto;
}

const matchesMock = [
  {
    matchId: 34,
    matchmakingMode: MatchmakingMode.CAPTAINS_MODE as any,
    gameMode: 3 as any,
    duration: 200,
    server: "fsdf",
    timestamp: new Date().getTime(),
    heroes: [
      {
        name: "fdf",
        team: 2,
        steamId: "fsdfd",
        hero: "npc_dota_hero_meepo",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.3,
        posY: 0.2,
        bot: false,
        level: 5,
      },
      {
        name: "fdf",
        team: 3,
        steamId: "fsdfd",
        hero: "npc_dota_hero_alchemist",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.4,
        posY: 0.6,
        bot: false,
        level: 5,
      },
    ],
  },
  {
    matchId: 34,
    matchmakingMode: MatchmakingMode.CAPTAINS_MODE as any,
    gameMode: 3 as any,
    duration: 200,
    server: "fsdf",
    timestamp: new Date().getTime(),
    heroes: [
      {
        name: "fdf",
        team: 2,
        steamId: "fsdfd",
        hero: "npc_dota_hero_meepo",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.3,
        posY: 0.2,
        bot: false,
        level: 5,
      },
      {
        name: "fdf",
        team: 3,
        steamId: "fsdfd",
        hero: "npc_dota_hero_alchemist",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.4,
        posY: 0.6,
        bot: false,
        level: 5,
      },
    ],
  },
  {
    matchId: 34,
    matchmakingMode: MatchmakingMode.CAPTAINS_MODE as any,
    gameMode: 3 as any,
    duration: 200,
    server: "fsdf",
    timestamp: new Date().getTime(),
    heroes: [
      {
        name: "fdf",
        team: 2,
        steamId: "fsdfd",
        hero: "npc_dota_hero_meepo",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.3,
        posY: 0.2,
        bot: false,
        level: 5,
      },
      {
        name: "fdf",
        team: 3,
        steamId: "fsdfd",
        hero: "npc_dota_hero_alchemist",
        kills: 2,
        deaths: 2,
        assists: 2,
        respawnTime: 2,
        item0: 2,
        item1: 3,
        item2: 3,
        item3: 3,
        item4: 3,
        item5: 3,
        health: 23,
        maxHealth: 23,
        mana: 23,
        maxMana: 23,
        angle: 32,
        posX: 0.4,
        posY: 0.6,
        bot: false,
        level: 5,
      },
    ],
  },
];
export default function MatchHistory({
  matches,
  liveMatches,
}: MatchHistoryProps) {
  const [page, setPage] = useQueryBackedParameter("page");
  const [mode, setMode] = useQueryBackedParameter("mode");

  const [isLoading] = useRouterChanging();

  const data = matches;

  useEffect(() => {
    if (data && numberOrDefault(page, 0) >= data.pages) {
      setPage(data.pages - 1);
    }
  }, [data?.pages]);

  return (
    <>
      <Head>
        <title>Матчи</title>
      </Head>
      <div className={c.panel}>
        <SelectOptions
          options={GameModeOptions}
          selected={mode === undefined ? "undefined" : mode}
          onSelect={(value) => {
            if (value === "undefined") setMode(undefined);
            else setMode(value);
          }}
          defaultText={"Режим игры"}
        />
      </div>
      <div>
        <MatchHistoryTable loading={isLoading} data={data?.data || []} />
        <Pagination
          linkProducer={(page) =>
            AppRouter.matches.index(page, mode || undefined).link
          }
          page={Number(page) || data?.page || 0}
          maxPage={data?.pages || 0}
        />
      </div>
    </>
  );
}

MatchHistory.getInitialProps = async (
  ctx: NextPageContext,
): Promise<MatchHistoryProps> => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  const mode = numberOrDefault(ctx.query.mode, undefined);

  const [matches, liveMatches] = await Promise.all<any>([
    useApi().matchApi.matchControllerMatches(page, undefined, mode),
  ]);
  return {
    matches,
  };
};
