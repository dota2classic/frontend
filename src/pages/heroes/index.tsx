import { useApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { HeroesMetaTable } from "@/components";
import Head from "next/head";
import { NextPageContext } from "next";

interface InitialProps {
  heroes: HeroSummaryDto[];
}

export default function Heroes({ heroes }: InitialProps) {
  return (
    <>
      <Head>
        <title>Герои</title>
      </Head>
      <HeroesMetaTable loading={false} data={heroes} />
    </>
  );
}

Heroes.getInitialProps = async (ctx: NextPageContext) => {
  const data = await useApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
