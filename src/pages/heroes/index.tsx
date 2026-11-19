import { HeroSummaryDto } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { HeroesMetaTable } from "@/components/HeroesMetaTable";
import React from "react";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface InitialProps {
  heroes: HeroSummaryDto[];
}

export default function Heroes({ heroes }: InitialProps) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("heroes.title")}
        description={t("heroes.description")}
      />
      <HeroesMetaTable loading={false} data={heroes} />
    </>
  );
}

Heroes.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const data = await api.metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
