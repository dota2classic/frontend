import { getApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { EmbedProps, HeroesMetaTable } from "@/components";
import React from "react";

interface InitialProps {
  heroes: HeroSummaryDto[];
}

export default function Heroes({ heroes }: InitialProps) {
  return (
    <>
      <EmbedProps
        title={"Герои"}
        description={
          "Статистика героев в старой Dota 2, сыгранных на сайте dotaclassic.ru"
        }
      />
      <HeroesMetaTable loading={false} data={heroes} />
    </>
  );
}

Heroes.getInitialProps = async () => {
  const data = await getApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
