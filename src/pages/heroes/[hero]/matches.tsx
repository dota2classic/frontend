import { HeroSummaryDto, MatchPageDto } from "@/api/back";
import {
  HeroStatsHeader,
  HeroWithItemsHistoryTable,
  Pagination,
  Section,
} from "@/components";
import React, { useMemo } from "react";
import { numberOrDefault } from "@/util/urls";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { useQueryBackedParameter, useRouterChanging } from "@/util";
import { matchToPlayerMatchItem } from "@/util/mappers";
import { AppRouter } from "@/route";
import { MatchComparator } from "@/util/sorts";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isLoading] = useRouterChanging();
  const [page] = useQueryBackedParameter("page");

  const sortedSummaries: HeroSummaryDto[] = useMemo(
    () => (initialHeroesMeta || []).toSorted((a, b) => b.games - a.games),
    [initialHeroesMeta],
  );

  const summary = useMemo(
    () => sortedSummaries.find((it) => it.hero === hero)!,
    [hero, sortedSummaries],
  );
  const formattedMatches = useMemo(
    () =>
      (initialMatchData?.data || [])
        .sort(MatchComparator)
        .map((it) => matchToPlayerMatchItem(it, (it) => it.hero === hero)),
    [hero, initialMatchData?.data],
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
          showUser
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

  const [initialMatchData, initialHeroesMeta] = await Promise.combine([
    getApi().matchApi.matchControllerHeroMatches(page, hero, undefined),
    getApi().metaApi.metaControllerHeroes(),
  ]);

  return {
    hero,
    initialMatchData,
    initialHeroesMeta,
  };
};
