import { getApi } from "@/api/hooks";
import { LiveMatchDto } from "@/api/back";
import React from "react";
import { LiveMatchPage } from "@/containers";
import { EmbedProps } from "@/components";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data }: InitialProps) {
  return (
    <>
      <EmbedProps
        title={"Просмотр матчей"}
        description={
          "Просмотр матчей, которые прямо сейчас играются на сайте dotaclassic.ru"
        }
      />

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
