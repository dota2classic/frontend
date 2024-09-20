import Head from "next/head";
import { useApi } from "@/api/hooks";
import c from "./LiveMatches.module.scss";
import { LiveMatchPreview, PageLink } from "@/components";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";
import { LiveMatchDto } from "@/api/back";

interface InitialProps {
  data: LiveMatchDto[];
}

export default function LiveMatches({ data: initialData }: InitialProps) {
  const { data } = useApi().liveApi.useLiveMatchControllerListMatches({
    refreshInterval: 3000,
    fallbackData: initialData,
  });

  return (
    <>
      <Head>
        <title>Текущие матчи - dota2classic.ru</title>
      </Head>

      {data?.length === 0 && (
        <div className={c.queue}>
          <span>Сейчас не идет ни одной игры.</span>
          <PageLink link={AppRouter.queue.link}>
            Отличный повод запустить поиск!
          </PageLink>
        </div>
      )}

      {data?.map((t) => <LiveMatchPreview match={t} />)}
    </>
  );
}

LiveMatches.getInitialProps = async (
  ctx: NextPageContext,
): Promise<InitialProps> => {
  const { data } = useApi().liveApi.liveMatchControllerListMatches();

  return {
    data,
  };
};
