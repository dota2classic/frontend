import { NextPageContext } from "next";
import { PlayerRecordsResponse, PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerSummary } from "@/components/PlayerSummary";
import React from "react";
import { PlayerRecords } from "@/containers/PlayerRecords";
import { useTranslation } from "react-i18next";
import { SectionBlock } from "@/components/SectionBlock";
import c from "@/pages/players/[id]/PlayerPage.module.scss";

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
    <div className={c.playerPage}>
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

      <SectionBlock className={c.fullwidth}>
        <PlayerRecords records={records} />
      </SectionBlock>
    </div>
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
