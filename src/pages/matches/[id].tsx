import { NextPageContext } from "next";
import React, { useCallback, useState } from "react";
import {
  EmbedProps,
  LiveMatchPreview,
  MatchSummary,
  MatchTeamTable,
  Typography,
} from "@/components";
import { FaTrophy } from "react-icons/fa";
import { getApi } from "@/api/hooks";
import {
  LiveMatchDto,
  LiveMatchDtoFromJSON,
  MatchDto,
  PlayerInMatchDto,
} from "@/api/back";
import { ThreadType } from "@/api/mapped-models/ThreadType";
import { useEventSource } from "@/util";
import { Tabs } from "@/components/Tabs/Tabs";
import c from "./Match.module.scss";
import { PlayerReportModal, Thread } from "@/containers";
import { Columns } from "@/components/MatchTeamTable/columns";

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

interface ReportModalData {
  reportedPlayer: PlayerInMatchDto;
  matchId: number;
}

const MatchThread = ({ id }: { id: string }) => {
  return (
    <Thread
      id={id}
      threadType={ThreadType.MATCH}
      className={c.queueDiscussion}
    />
  );
};

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

  const [reportModalData, setReportModalData] = useState<
    ReportModalData | undefined
  >(undefined);

  const showReportModal = useCallback(
    (pim: PlayerInMatchDto) => {
      setReportModalData({ reportedPlayer: pim, matchId: matchId });
    },
    [matchId],
  );
  const closeModal = useCallback(() => {
    console.log("close");
    setReportModalData(undefined);
  }, []);

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
        {reportModalData && (
          <PlayerReportModal
            onClose={closeModal}
            player={reportModalData.reportedPlayer}
            matchId={reportModalData.matchId}
          />
        )}
        <EmbedProps
          title={`Матч ${matchId}`}
          description={`Страница матча с ID ${matchId}, сыгранного на старом клиенте Dota 2 6.84 на сайте dotaclassic.ru`}
        />
        <MatchSummary
          radiantKills={match.radiant.reduce((a, b) => a + b.kills, 0)}
          direKills={match.dire.reduce((a, b) => a + b.kills, 0)}
          winner={match.winner}
          matchId={match.id}
          duration={match.duration}
          timestamp={match.timestamp}
          mode={match.mode}
          gameMode={match.gameMode}
          replay={match.replayUrl}
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
          onTryReport={showReportModal}
          reportable={match.reportable}
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
          onTryReport={showReportModal}
          reportable={match.reportable}
          filterColumns={filter.columns}
          duration={match.duration}
          players={match.dire}
        />

        <br />
        <br />
        <MatchThread id={match.id.toString()} />
      </>
    );

  // if no match, maybe it live?
  if (isMatchLive && liveMatch)
    return (
      <>
        <MatchSummary
          radiantKills={liveMatch.heroes
            .filter((t) => t.team === 2)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0)}
          direKills={liveMatch.heroes
            .filter((t) => t.team === 3)
            .reduce((a, b) => a + (b.heroData?.kills || 0), 0)}
          matchId={liveMatch.matchId}
          duration={liveMatch.duration}
          mode={liveMatch.matchmakingMode}
          gameMode={liveMatch.gameMode}
          gameState={liveMatch.gameState}
        />
        <br />
        <LiveMatchPreview match={liveMatch} />
        <MatchThread id={liveMatch.matchId.toString()} />
      </>
    );

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
