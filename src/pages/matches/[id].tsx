import { NextPageContext } from "next";
import React, { useState } from "react";
import {
  LiveMatchPreview,
  MatchSummary,
  MatchTeamTable,
  Thread,
  Typography,
} from "@/components";
import { FaTrophy } from "react-icons/fa";
import { getApi } from "@/api/hooks";
import { LiveMatchDto, LiveMatchDtoFromJSON, MatchDto } from "@/api/back";
import Head from "next/head";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { ThreadStyle } from "@/components/Thread/types";
import { useEventSource } from "@/util/hooks";
import { Columns } from "@/components/MatchTeamTable/MatchTeamTable";
import { Tabs } from "@/components/Tabs/Tabs";

interface InitialProps {
  matchId: number;
  preloadedMatch: MatchDto | undefined;
  liveMatches: LiveMatchDto[];
}
type Filter = { label: string; columns: Columns[] };

const options: Filter[] = [
  {
    label: "Сводка",
    columns: ["K", "D", "A", "NW", "MMR"],
  },
  {
    label: "Фарм",
    columns: ["GPM", "LH", "NW"],
  },
  {
    label: "Урон",
    columns: ["HD", "TD", "NW"],
  },
  {
    label: "Предметы",
    columns: ["Items"],
  },
];

export default function MatchPage({
  matchId,
  preloadedMatch,
  liveMatches,
}: InitialProps) {
  const { data: match } = getApi().matchApi.useMatchControllerMatch(matchId, {
    fallbackData: preloadedMatch,
    isPaused() {
      return !!preloadedMatch;
    },
  });

  const isMatchLive =
    liveMatches.findIndex((t) => t.matchId === matchId) !== -1;

  const liveMatch = useEventSource<LiveMatchDto>(
    getApi().liveApi.liveMatchControllerLiveMatchContext({ id: matchId }),
    LiveMatchDtoFromJSON.bind(null),
  );

  const [filter, setFilter] = useState<Filter>(options[0]);

  if (match)
    return (
      <>
        <Head>
          <title>{`Матч ${matchId}`}</title>
        </Head>
        <MatchSummary
          radiantKills={match.radiant.reduce((a, b) => a + b.kills, 0)}
          direKills={match.dire.reduce((a, b) => a + b.kills, 0)}
          winner={match.winner}
          matchId={match.id}
          duration={match.duration}
          timestamp={match.timestamp}
          mode={match.mode}
        />

        <Typography.Header radiant>
          Силы Света {match.winner === 2 && <FaTrophy color={"white"} />}
        </Typography.Header>
        <Tabs
          className={"mobile-only"}
          options={options.map((t) => t.label)}
          selected={filter.label}
          onSelect={(v) => setFilter(options.find((x) => x.label === v)!)}
        />
        <MatchTeamTable
          filterColumns={filter.columns}
          duration={match.duration}
          players={match.radiant}
        />
        <br />

        <Typography.Header dire>
          Силы Тьмы {match.winner === 3 && <FaTrophy color={"white"} />}
        </Typography.Header>
        <Tabs
          className={"mobile-only"}
          options={options.map((t) => t.label)}
          selected={filter.label}
          onSelect={(v) => setFilter(options.find((x) => x.label === v)!)}
        />
        <MatchTeamTable
          filterColumns={filter.columns}
          duration={match.duration}
          players={match.dire}
        />

        <br />
        <br />
        <Thread
          threadStyle={ThreadStyle.SMALL}
          id={match.id.toString()}
          threadType={ThreadType.MATCH}
        />
      </>
    );

  // if no match, maybe it live?
  if (isMatchLive && liveMatch) return <>
    <LiveMatchPreview match={liveMatch} />
    {/*<Thread*/}
    {/*  threadStyle={ThreadStyle.SMALL}*/}
    {/*  id={liveMatch.matchId.toString()}*/}
    {/*  threadType={ThreadType.MATCH}*/}
    {/*/>*/}
  </>;

  return null;
}

MatchPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const matchId = parseInt(ctx.query.id as string);
  console.log("STarted getting initial props");
  const [match, liveList] = await Promise.combine([
    getApi()
      .matchApi.matchControllerMatch(matchId)
      .catch(() => undefined),
    getApi().liveApi.liveMatchControllerListMatches(),
  ]);

  return {
    matchId,
    preloadedMatch: match,
    liveMatches: liveList,
  };
};
