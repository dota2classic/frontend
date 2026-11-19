import { LiveMatchDto } from "@/api/back";
import React from "react";
import { LiveMatchPage } from "@/containers/LiveMatchPage";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

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

LiveMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const api = getRequestApi(ctx);
  const data = await api.liveApi.liveMatchControllerListMatches();

  return {
    data,
  };
};
