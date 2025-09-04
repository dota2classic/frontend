import { getApi } from "@/api/hooks";
import { LiveMatchDto } from "@/api/back";
import React from "react";
import { LiveMatchPage } from "@/containers/LiveMatchPage";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data }: InitialProps) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("live_matches.seo.title")}
        description={t("live_matches.seo.description")}
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
