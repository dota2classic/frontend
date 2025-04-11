import { PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import { EmbedProps, Panel, PlayerSummary, Section } from "@/components";
import React from "react";
import c from "./PlayerPage.module.scss";
import Image from "next/image";
import { FaCoins } from "react-icons/fa";
import { NextPageContext } from "next";

interface SelectHat {
  hats: {
    image: string;
    price: number;
    bought: boolean;
  }[];
}

interface Props {
  preloadedSummary: PlayerSummaryDto;
}

export default function PlayerCustomizationPage({ preloadedSummary }: Props) {
  return (
    <>
      <EmbedProps
        title={`${preloadedSummary.user.name} история матчей`}
        description={`История матчей игрока ${preloadedSummary.user.name}. Список игр сыгранных в старую доту`}
      />

      <PlayerSummary
        wins={preloadedSummary.wins}
        loss={preloadedSummary.loss}
        rank={preloadedSummary.rank}
        mmr={preloadedSummary.mmr}
        user={preloadedSummary.user}
      />
    </>
  );
}

PlayerCustomizationPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const playerId = ctx.query.id as string;

  const preloadedSummary =
    await getApi().playerApi.playerControllerPlayerSummary(playerId);

  return {
    preloadedSummary,
  };
};
