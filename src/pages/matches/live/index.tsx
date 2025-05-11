import Head from "next/head";
import { getApi } from "@/api/hooks";
import { LiveMatchDto } from "@/api/back";
import React from "react";
import { LiveMatchPage } from "@/containers";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data }: InitialProps) {
  return (
    <>
      <Head>
        <title>Текущие матчи - dota2classic.ru</title>
      </Head>

      <LiveMatchPage games={data} />
    </>
  );
}

LiveMatches.getInitialProps = async (): Promise<InitialProps> => {
  const data = await getApi().liveApi.liveMatchControllerListMatches();

  return {
    data,
  };
};
