import { useApi } from "@/api/hooks";
import { HeroSummaryDto } from "@/api/back";
import { HeroesMetaTable } from "@/components";

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
      <HeroesMetaTable loading={isLoading} data={data || []}/>
    </>
  );
}

Heroes.getInitialProps = async (ctx) => {
  const data = await useApi().metaApi.metaControllerHeroes();

  return {
    heroes: data,
  };
};
