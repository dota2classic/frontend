/* eslint-disable @next/next/no-sync-scripts */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TournamentBracketDto } from "@/containers/BracketRenderer/types";
import Head from "next/head";
import c from "./BracketRenderer.module.scss";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import "react-datepicker/dist/react-datepicker.css";

import {
  BracketsViewer,
  MatchWithMetadata,
  ViewerData,
} from "@/brackets-viewer";
import { EditMatchModal } from "@/components/EditMatchModal";
import { useRefreshPageProps } from "@/util/usePageProps";
import { BracketMatchDto } from "@/api/back";

interface IBracketRendererProps {
  uniqueId: string;
  bracket: TournamentBracketDto;
  admin?: boolean;
}

interface ParticipantImage {
  participantId: number;
  imageUrl: string;
}

export const BracketRenderer: React.FC<IBracketRendererProps> = ({
  uniqueId,
  admin,
  bracket,
}) => {
  const [matchId, setMatchId] = useState<number | undefined>();

  const viewer = useMemo(() => new BracketsViewer(), []);
  const refreshPage = useRefreshPageProps();

  const match = useMemo<BracketMatchDto | undefined>(() => {
    return bracket.match.find(
      (t) => t.id === matchId,
    ) as unknown as BracketMatchDto;
  }, [bracket, matchId]);

  const onMatchClick = useCallback(
    (match: MatchWithMetadata) => {
      if (!admin) return;
      setMatchId(Number(match.id));
    },
    [admin],
  );

  useEffect(() => {
    viewer.setParticipantImages(
      bracket.participant.map(
        (p) =>
          ({
            participantId: p.id,
            imageUrl: p.players[0].avatar,
          }) satisfies ParticipantImage,
      ),
    );

    viewer.render(
      {
        stages: bracket.stage,
        matches: bracket.match,
        matchGames: bracket.match_game,
        participants: bracket.participant,
      } as unknown as ViewerData,
      {
        clear: true,
        selector: `#${uniqueId}`,
        onMatchClick,
      },
    );
  }, [
    bracket.stage,
    bracket.match,
    bracket.match_game,
    bracket.participant,
    uniqueId,
  ]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.css"
        />
      </Head>

      <script
        type="text/javascript"
        // src="https://cdn.jsdelivr.net/npm/brackets-viewer@latest/dist/brackets-viewer.min.js"
        src="/brackets-viewer.min.js"
      ></script>

      <QueuePageBlock heading={"Сетка турнира"} className={c.wrapper}>
        {match && (
          <EditMatchModal
            match={match!}
            onClose={() => setMatchId(undefined)}
            onUpdated={refreshPage}
          />
        )}
        <div className="brackets-viewer" id={uniqueId} />
      </QueuePageBlock>
    </>
  );
};
