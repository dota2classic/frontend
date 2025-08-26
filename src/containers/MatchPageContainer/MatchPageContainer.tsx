import React, { useCallback, useMemo, useState } from "react";
import {
  LiveMatchDto,
  LiveMatchDtoFromJSON,
  MatchDto,
  MatchReportInfoDto,
  PlayerInMatchDto,
} from "@/api/back";
import { Columns } from "@/components/MatchTeamTable/columns";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { useEventSource } from "@/util";
import { PlayerFeedbackModal } from "@/containers";
import {
  EmbedProps,
  LiveMatchPreview,
  MatchSummary,
  MatchTeamTable,
  Tabs,
  Typography,
} from "@/components";
import { FaTrophy } from "react-icons/fa";
import { MatchThread } from "@/containers/MatchPageContainer/MatchThread";
import { observer } from "mobx-react-lite";
import { getMaxMatchValues } from "@/util/useMaxMatchValues";
import { useTranslation } from "react-i18next";

interface IMatchPageContainerProps {
  matchId: number;
  preloadedMatch: MatchDto | undefined;
  liveMatches: LiveMatchDto[];
}

type Filter = { label: string; columns: Columns[] };

const options: Filter[] = [
  {
    label: "match_summary",
    columns: ["K", "D", "A", "NW"],
  },
  {
    label: "farming",
    columns: ["GPM", "LH", "NW"],
  },
  {
    label: "damage",
    columns: ["HD", "TD", "NW"],
  },
  {
    label: "items",
    columns: ["Items"],
  },
  {
    label: "other",
    columns: ["MMR", "Actions"],
  },
];

interface ReportModalData {
  reportedPlayer: PlayerInMatchDto;
  matchId: number;
}

const useReportModal = (
  matchId: number,
): [ReportModalData | undefined, (p: PlayerInMatchDto) => void, () => void] => {
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
    setReportModalData(undefined);
  }, []);

  return [reportModalData, showReportModal, closeModal];
};

export const MatchPageContainer: React.FC<IMatchPageContainerProps> = observer(
  ({ matchId, preloadedMatch, liveMatches }: IMatchPageContainerProps) => {
    const { t } = useTranslation();
    const { report } = useStore();
    const { data: match } = getApi().matchApi.useMatchControllerMatch(matchId, {
      fallbackData: preloadedMatch,
      isPaused() {
        return !!preloadedMatch;
      },
    });

    const onReport = useCallback(
      (pim: PlayerInMatchDto) => {
        report.setReportMeta({ matchId, player: pim });
      },
      [matchId, report],
    );

    const { data: reportMatrix, mutate: updateReportMatrix } =
      getApi().matchApi.useMatchControllerMatchReportMatrix(matchId);

    const reportableSteamIds: string[] = useMemo(() => {
      return reportMatrix?.reportableSteamIds || [];
    }, [reportMatrix]);

    const [feedbackData, showFeedbackModal, closeFeedbackModal] =
      useReportModal(matchId);

    const isMatchLive =
      liveMatches.findIndex((t) => t.matchId === matchId) !== -1;

    const liveMatch = useEventSource<LiveMatchDto>(
      getApi().liveApi.liveMatchControllerLiveMatchContext({ id: matchId }),
      LiveMatchDtoFromJSON.bind(null),
    );

    const [filter, setFilter] = useState<Filter>(options[0]);

    const allPlayers: PlayerInMatchDto[] = useMemo(() => {
      if (!match) return [];
      return [...match.radiant, ...match.dire];
    }, [match]);

    const globalMaxValues = useMemo(
      () => (match ? getMaxMatchValues(allPlayers, match.duration) : undefined),
      [allPlayers, match],
    );

    if (match) {
      return (
        <>
          {feedbackData && (
            <PlayerFeedbackModal
              onClose={closeFeedbackModal}
              player={feedbackData.reportedPlayer}
              matchId={feedbackData.matchId}
              onReport={async (r: MatchReportInfoDto) => {
                await updateReportMatrix(r);
              }}
            />
          )}
          <EmbedProps
            title={t("match.title", { matchId })}
            description={t("match.description", { matchId })}
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
            {t("match.radiant", { winner: match.winner })}{" "}
            {match.winner === 2 && <FaTrophy color={"white"} />}
          </Typography.Header>
          <Tabs
            className={"mobile-only"}
            options={options.map((t) => t.label)}
            selected={filter.label}
            onSelect={(v) => setFilter(options.find((x) => x.label === v)!)}
          />
          <MatchTeamTable
            onReport={onReport}
            onFeedback={showFeedbackModal}
            reportableSteamIds={reportableSteamIds}
            filterColumns={filter.columns}
            duration={match.duration}
            globalMaxValues={globalMaxValues}
            players={match.radiant}
          />
          <br />

          <Typography.Header dire>
            {t("match.dire", { winner: match.winner })}{" "}
            {match.winner === 3 && <FaTrophy color={"white"} />}
          </Typography.Header>
          <Tabs
            className={"mobile-only"}
            options={options.map((t) => t.label)}
            selected={filter.label}
            onSelect={(v) => setFilter(options.find((x) => x.label === v)!)}
          />
          <MatchTeamTable
            onReport={onReport}
            onFeedback={showFeedbackModal}
            reportableSteamIds={reportableSteamIds}
            filterColumns={filter.columns}
            duration={match.duration}
            globalMaxValues={globalMaxValues}
            players={match.dire}
          />

          <br />
          <br />
          <MatchThread id={match.id.toString()} />
        </>
      );
    }

    // if no match, maybe it live?
    if (isMatchLive && liveMatch) {
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
    }

    return null;
  },
);
