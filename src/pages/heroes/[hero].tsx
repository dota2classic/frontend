import { useApi } from "@/api/hooks";
import {
  HeroItemDto,
  HeroPlayerDto,
  HeroSummaryDto,
  MatchPageDto,
} from "@/api/back";
import {
  HeroIcon,
  HeroItemsTable,
  HeroPlayersTable,
  Panel,
  PlayerMatchTable,
  Section,
} from "@/components";
import { useDidMount, useQueryBackedParameter } from "@/util/hooks";
import { numberOrDefault } from "@/util/urls";
import c from "./HeroPage.module.scss";
import { matchToPlayerMatchItem } from "@/util/mappers";
import React from "react";
import heroName from "@/util/heroName";
import { formatWinrate } from "@/util/math";
import Head from "next/head";
import { NextPageContext } from "next";

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
  const [page, setPage] = useQueryBackedParameter("page");

  const mounted = useDidMount();
  const { data: matchesData, isLoading: isMatchesLoading } =
    useApi().matchApi.useMatchControllerHeroMatches(
      numberOrDefault(page, 0),
      hero,
      undefined,
      {
        fallbackData: initialMatchData,
        isPaused() {
          return !mounted;
        },
      },
    );

  const { data: itemsData, isLoading: isItemsLoading } =
    useApi().metaApi.useMetaControllerHero(hero, {
      fallbackData: initialHeroItemsData,
      isPaused() {
        return !mounted;
      },
    });

  const { data: heroPlayers, isLoading: heroPlayersLoading } =
    useApi().metaApi.useMetaControllerHeroPlayers(hero, {
      fallbackData: initialHeroPlayers,
      isPaused() {
        return !mounted;
      },
    });

  const { data: summaries } = useApi().metaApi.useMetaControllerHeroes({
    fallbackData: initialHeroesMeta,
    isPaused() {
      return !mounted;
    },
  });

  const sortedSummaries: HeroSummaryDto[] = (summaries || []).toSorted(
    (a, b) => b.games - a.games,
  );

  const formattedMatches = (matchesData?.data || []).map((it) =>
    matchToPlayerMatchItem(it, (it) => it.hero === hero),
  );

  const summary = sortedSummaries.find((it) => it.hero === hero)!;

  return (
    <div className={c.page}>
      <Head>
        <title>{heroName(hero)}</title>
      </Head>
      <Panel className={c.heroSummary}>
        <div className={"left"}>
          <HeroIcon hero={hero} />
          <span className={c.heroName}>{heroName(hero)}</span>
        </div>
        <div className="right">
          <dl>
            <dd>{sortedSummaries.indexOf(summary) + 1}</dd>
            <dt>Популярность</dt>
          </dl>

          <dl>
            <dd className="green">{summary.games}</dd>
            <dt>Матчи</dt>
          </dl>
          <dl>
            <dd className="green">{summary.wins}</dd>
            <dt>Победы</dt>
          </dl>

          <dl>
            <dd className={summary.wins > summary.losses ? "green" : "red"}>
              {formatWinrate(summary.wins, summary.losses)}
            </dd>
            <dt>Доля побед</dt>
          </dl>
        </div>
      </Panel>
      <Section className={c.matchHistory}>
        <header>История матчей</header>
        <PlayerMatchTable loading={isMatchesLoading} data={formattedMatches} />
      </Section>
      <Section className={c.items}>
        <header>Лучшие игроки</header>
        <HeroPlayersTable
          loading={heroPlayersLoading}
          data={heroPlayers || []}
        />
        <header>Предметы</header>
        <HeroItemsTable
          loading={isItemsLoading}
          data={(itemsData || []).slice(0, 20)}
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
  ] = await Promise.all<any>([
    useApi().matchApi.matchControllerHeroMatches(page, hero, undefined),
    useApi().metaApi.metaControllerHero(hero),
    useApi().metaApi.metaControllerHeroes(),
    useApi().metaApi.metaControllerHeroPlayers(hero),
  ]);

  return {
    hero,
    initialMatchData,
    initialHeroItemsData,
    initialHeroesMeta,
    initialHeroPlayers,
  };
};
