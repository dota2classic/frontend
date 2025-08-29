import { getApi } from "@/api/hooks";
import {
  HeroItemDto,
  HeroPlayerDto,
  HeroSummaryDto,
  MatchPageDto,
} from "@/api/back";
import {
  EmbedProps,
  HeroItemsTable,
  HeroPlayersTable,
  HeroStatsHeader,
  HeroWithItemsHistoryTable,
  PageLink,
  Section,
} from "@/components";
import { numberOrDefault } from "@/util/urls";
import c from "./HeroPage.module.scss";
import { matchToPlayerMatchItem } from "@/util/mappers";
import React from "react";
import heroName from "@/util/heroName";
import { NextPageContext } from "next";
import { AppRouter } from "@/route";
import { MatchComparator } from "@/util/sorts";
import { useTranslation } from "react-i18next";

interface InitialProps {
  initialMatchData: MatchPageDto;
  initialHeroItemsData: HeroItemDto[];
  initialHeroesMeta: HeroSummaryDto[];
  initialHeroPlayers: HeroPlayerDto[];
  hero: string;
}

export default function HeroHistoryPage({
  initialHeroItemsData,
  initialMatchData,
  initialHeroesMeta,
  initialHeroPlayers,
  hero,
}: InitialProps) {
  const { t } = useTranslation();

  const sortedSummaries: HeroSummaryDto[] = initialHeroesMeta.toSorted(
    (a, b) => b.games - a.games,
  );

  const formattedMatches = initialMatchData.data
    .sort(MatchComparator)
    .map((it) => matchToPlayerMatchItem(it, (it) => it.hero === hero));

  const summary = sortedSummaries.find((it) => it.hero === hero)!;

  return (
    <div className={c.page}>
      <EmbedProps
        title={t("hero_page.seo.title", { hero: heroName(hero) })}
        description={t("hero_page.seo.description", {
          hero: heroName(hero),
          rank: sortedSummaries.indexOf(summary) + 1,
        })}
      />
      <HeroStatsHeader
        popularity={sortedSummaries.indexOf(summary) + 1}
        hero={hero}
        wins={summary.wins}
        games={summary.games}
      />
      <Section className={c.matchHistory}>
        <header>
          {t("hero_page.matchHistory")}
          <PageLink link={AppRouter.heroes.hero.matches(hero).link}>
            {t("hero_page.showMore")}
          </PageLink>
        </header>
        <HeroWithItemsHistoryTable
          loading={false}
          data={formattedMatches}
          showUser
        />
      </Section>
      <Section className={c.items}>
        <header>{t("hero_page.topPlayers")}</header>
        <HeroPlayersTable
          hero={hero}
          loading={false}
          data={initialHeroPlayers}
        />
        <header>{t("hero_page.items")}</header>
        <HeroItemsTable
          loading={false}
          data={initialHeroItemsData.slice(0, 20)}
        />
      </Section>
    </div>
  );
}

HeroHistoryPage.getInitialProps = async (ctx: NextPageContext) => {
  let hero = ctx.query.hero as string;
  hero = hero.includes("npc_dota_hero_") ? hero : `npc_dota_hero_${hero}`;

  const page = numberOrDefault(ctx.query.page as string, 0);

  const [
    initialMatchData,
    initialHeroItemsData,
    initialHeroesMeta,
    initialHeroPlayers,
  ] = await Promise.combine([
    getApi().matchApi.matchControllerHeroMatches(page, hero, undefined),
    getApi().metaApi.metaControllerHero(hero),
    getApi().metaApi.metaControllerHeroes(),
    getApi().metaApi.metaControllerHeroPlayers(hero),
  ]);

  return {
    hero,
    initialMatchData,
    initialHeroItemsData,
    initialHeroesMeta,
    initialHeroPlayers,
  };
};
