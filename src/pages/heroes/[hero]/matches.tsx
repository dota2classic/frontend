import { HeroSummaryDto, MatchPageDto } from "@/api/back";
import {
  HeroStatsHeader,
  HeroWithItemsHistoryTable,
  Pagination,
  Section,
} from "@/components";
import React, { useMemo } from "react";
import { numberOrDefault } from "@/util/urls";
import { useApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { useQueryBackedParameter, useRouterChanging } from "@/util/hooks";
import { matchToPlayerMatchItem } from "@/util/mappers";
import { AppRouter } from "@/route";

interface Props {
  hero: string;
  initialMatchData: MatchPageDto;
  initialHeroesMeta: HeroSummaryDto[];
}

export default function HeroMatches({
  hero,
  initialMatchData,
  initialHeroesMeta,
}: Props) {
  const [isLoading] = useRouterChanging();
  const [page, setPage] = useQueryBackedParameter("page");

  const sortedSummaries: HeroSummaryDto[] = useMemo(
    () => (initialHeroesMeta || []).toSorted((a, b) => b.games - a.games),
    [initialHeroesMeta],
  );

  const summary = useMemo(
    () => sortedSummaries.find((it) => it.hero === hero)!,
    [initialHeroesMeta],
  );
  const formattedMatches = useMemo(
    () =>
      (initialMatchData?.data || []).map((it) =>
        matchToPlayerMatchItem(it, (it) => it.hero === hero),
      ),
    [initialMatchData],
  );

  return (
    <>
      <HeroStatsHeader
        popularity={sortedSummaries.indexOf(summary) + 1}
        hero={hero}
        wins={summary.wins}
        games={summary.games}
      />
      <Section>
        <Pagination
          linkProducer={(page) =>
            AppRouter.heroes.hero.matches(hero, page).link
          }
          page={Number(page) || initialMatchData?.page || 0}
          maxPage={initialMatchData?.pages || 0}
        />
        <HeroWithItemsHistoryTable
          withItems
          loading={isLoading}
          data={formattedMatches}
        />
        <Pagination
          linkProducer={(page) =>
            AppRouter.heroes.hero.matches(hero, page).link
          }
          page={Number(page) || initialMatchData?.page || 0}
          maxPage={initialMatchData?.pages || 0}
        />
      </Section>
    </>
  );
}

HeroMatches.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  let hero = ctx.query.hero as string;
  hero = hero.includes("npc_dota_hero_") ? hero : `npc_dota_hero_${hero}`;

  const page = numberOrDefault(ctx.query.page as string, 0);

  const [initialMatchData, initialHeroesMeta] = await Promise.all<any>([
    useApi().matchApi.matchControllerHeroMatches(page, hero, undefined),
    useApi().metaApi.metaControllerHeroes(),
  ]);

  return {
    hero,
    initialMatchData,
    initialHeroesMeta,
  };
};
