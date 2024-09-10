import { useApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { HeroesMetaTable } from "@/components";
import Head from "next/head";

interface InitialProps {
  heroes: HeroSummaryDto[];
}

export default function Heroes({ heroes }: InitialProps) {
  const { data, isLoading } = useApi().metaApi.useMetaControllerHeroes({
    fallbackData: heroes,
    isPaused() {
      return true;
    },
  });

  return (
    <>
      <Head>
        <title>Герои</title>
      </Head>
      <HeroesMetaTable loading={isLoading} data={data || []} />
    </>
  );
}

Heroes.getInitialProps = async (ctx) => {
  const data = await useApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
