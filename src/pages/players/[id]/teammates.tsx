import { NextPageContext } from "next";
import { parsePage } from "@/util/urls";
import React, { useState } from "react";
import { PlayerSummaryDto, PlayerTeammatePageDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { maxBy } from "@/util/maxBy";
import { useTranslation } from "react-i18next";
import { PlayerSummary } from "@/components/PlayerSummary";
import { TeammatesTable } from "@/components/TeammatesTable";
import { ScrollDetector } from "@/components/ScrollDetecter";
import { EmbedProps } from "@/components/EmbedProps";
import { SectionBlock } from "@/components/SectionBlock";
import c from "./PlayerPage.module.scss";
import { loadPlayerPage } from "@/util/load-player-page";

interface Props {
  summary: PlayerSummaryDto;
  preloadedTeammates: PlayerTeammatePageDto;
  playerId: string;
}

export default function PlayerTeammates({
  preloadedTeammates,
  playerId,
  summary,
}: Props) {
  const { t } = useTranslation();
  const [totalData, setTotalData] = useState<
    Record<number, PlayerTeammatePageDto>
  >({
    [preloadedTeammates.page]: preloadedTeammates,
  });
  const [reachedBottom, setReachedBottom] = useState(false);

  const onScrollToEnd = async () => {
    if (reachedBottom) return;

    const maxPage = maxBy(Object.values(totalData), (it) => it.page)!.page;
    const data = await getApi().playerApi.playerControllerTeammates(
      playerId,
      maxPage + 1,
    );
    if (data.data.length === 0) {
      setReachedBottom(true);
      return;
    }

    setTotalData({
      ...totalData,
      [data.page]: data,
    });
  };

  return (
    <div className={c.playerPage}>
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />
      <EmbedProps
        description={t("player_teammates.seo.description", {
          player: summary.user.name,
        })}
        title={t("player_teammates.seo.title", {
          player: summary.user.name,
        })}
      />
      <SectionBlock
        className={c.fullwidth}
        title={t("player_teammates.header")}
      >
        <TeammatesTable
          data={Object.values(totalData).flatMap((it) => it.data)}
        />
        <ScrollDetector onScrolledTo={onScrollToEnd} />
      </SectionBlock>
    </div>
  );
}

PlayerTeammates.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = parsePage(ctx.query.page);

  const {
    playerId,
    summary,
    data: [preloadedTeammates],
  } = await loadPlayerPage(ctx, (api, playerId) => [
    api.playerApi.playerControllerTeammates(playerId, page, undefined),
  ]);

  return {
    summary,
    preloadedTeammates,
    playerId,
  };
};
