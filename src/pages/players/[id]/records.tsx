import { NextPageContext } from "next";
import { PlayerRecordsResponse, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerSummary } from "@/components/PlayerSummary";
import React from "react";
import { PlayerRecords } from "@/containers/PlayerRecords";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

interface Props {
  preloadedSummary: PlayerSummaryDto;
  records: PlayerRecordsResponse;
}

export default function PlayerRecordsPage({
  records,
  preloadedSummary,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("player_records.seo.title", {
          name: preloadedSummary.user.name,
        })}
        description={t("player_records.seo.description", {
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

      <QueuePageBlock>
        <PlayerRecords records={records} />
      </QueuePageBlock>
    </>
  );
}

PlayerRecordsPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  const [preloadedSummary, records] = await Promise.combine([
    getApi().playerApi.playerControllerPlayerSummary(playerId),
    getApi().record.recordControllerPlayerRecords(playerId),
  ]);

  return {
    preloadedSummary,
    records,
  };
};
