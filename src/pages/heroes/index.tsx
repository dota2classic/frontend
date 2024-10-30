import { getApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { HeroesMetaTable } from "@/components";
import Head from "next/head";

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

Heroes.getInitialProps = async () => {
  const data = await getApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
