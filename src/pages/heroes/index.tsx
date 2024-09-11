import { useApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { HeroesMetaTable } from "@/components";
import Head from "next/head";
import { useRouterChanging } from "@/util/hooks";

interface InitialProps {
  heroes: HeroSummaryDto[];
}

export default function Heroes({ heroes }: InitialProps) {
  const [isLoading] = useRouterChanging();
  return (
    <>
      <Head>
        <title>Герои</title>
      </Head>
      <HeroesMetaTable loading={false} data={heroes || []} />
    </>
  );
}

Heroes.getInitialProps = async (ctx) => {
  const data = await useApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
