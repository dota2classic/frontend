import { NextPageContext } from "next";
import React from "react";
import {
  DroppedItemDto,
  PlayerSummaryDto,
  SubscriptionProductDto,
  TradeOfferDto,
  TradeUserDto,
} from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps } from "@/components/EmbedProps";
import { PlayerSummary } from "@/components/PlayerSummary";
import { DropList } from "@/containers/DropList";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { useTranslation } from "react-i18next";
import c from "./PlayerPage.module.scss";

interface Props {
  steamId: string;
  drops: DroppedItemDto[];
  trades: TradeOfferDto[];
  summary: PlayerSummaryDto;
  user: TradeUserDto;
  products: SubscriptionProductDto[];
}

export default function PlayerDrops({
  drops,
  summary,
  user,
  trades,
  products,
}: Props) {
  const { t } = useTranslation();
  return (
    <div className={c.playerPage}>
      <EmbedProps
        description={t("player_drops.receivedItemsSettings")}
        title={t("player_drops.items")}
      />
      <PlayerSummary
        session={summary.session}
        banStatus={summary.banStatus}
        stats={summary.overallStats}
        user={summary.user}
        rank={summary.seasonStats.rank}
        mmr={summary.seasonStats.mmr}
      />

      <DropList
        products={products}
        trades={trades}
        drops={drops}
        summary={summary}
        user={user}
      />
    </div>
  );
}

PlayerDrops.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const steamId = ctx.query.id as string;
  const [summary, drops, user, trades, products] = await withTemporaryToken(
    ctx,
    () =>
      Promise.combine([
        getApi().playerApi.playerControllerPlayerSummary(steamId),
        getApi().drops.itemDropControllerGetMyDrops(),
        getApi().drops.itemDropControllerGetUser(),
        getApi().drops.itemDropControllerGetTrades(),
        getApi().payment.userPaymentsControllerGetProducts(),
      ]),
  );

  return {
    drops,
    summary,
    user,
    steamId,
    trades,
    products,
  };
};
