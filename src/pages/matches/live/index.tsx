import { getApi } from "@/api/hooks";
import { LiveMatchDto } from "@/api/back";
import React from "react";
import { LiveMatchPage } from "@/containers";
import { EmbedProps } from "@/components";
import { useTranslation } from "react-i18next";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data }: InitialProps) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("live_matches.viewMatches")}
        description={t("live_matches.viewMatchesDescription")}
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
