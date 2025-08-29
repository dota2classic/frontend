import {
  Carousel,
  CarouselItem,
  EmbedProps,
  MatchHistoryTable,
  PageLink,
  Section,
} from "@/components";
import React from "react";
import c from "./Meta.module.scss";
import cx from "clsx";
import { AppRouter } from "@/route";
import { getApi } from "@/api/hooks";
import { MatchmakingMode } from "@/api/mapped-models";
import { MatchPageDto } from "@/api/back";
import { useTranslation } from "react-i18next";

interface Props {
  matches: MatchPageDto;
}

export default function MetaPage({ matches }: Props) {
  const { t } = useTranslation();

  return (
    <div className={cx("grid", c.grid)}>
      <EmbedProps
        title={t("meta_page.seo.title")}
        description={t("meta_page.seo.description")}
      />
      <h2 className="grid6">{t("meta_page.meta")}</h2>
      <Section className={"grid12"}>
        <Carousel gridCnt={2}>
          <CarouselItem
            title={t("meta_page.strongItems")}
            image={
              "https://cdn.dotaclassic.ru/public/upload/9f03797a85c098fc5496d248e6bb011fe67a516afa63dc48c75eaf181ef49212.webp"
            }
            description={t("meta_page.itemsDescription")}
            link={AppRouter.items.index.link}
          />

          <CarouselItem
            title={t("meta_page.metaHeroes")}
            image={
              "https://cdn.dotaclassic.ru/public/upload/c56591b5a79d7ff50e5044c0282867986aaca67c31119efeecf71fe03bfaecf5.webp"
            }
            description={t("meta_page.heroesDescription")}
            link={AppRouter.heroes.index.link}
          />
        </Carousel>
      </Section>

      <h2 className="grid6">{t("meta_page.achievements")}</h2>
      <Section className={"grid12"}>
        <Carousel gridCnt={2}>
          <CarouselItem
            title={t("meta_page.leaderBoard")}
            image={"/landing/leaderboard.webp"}
            description={t("meta_page.topPlayers")}
            link={AppRouter.players.leaderboard().link}
          />

          <CarouselItem
            title={t("meta_page.records")}
            image={
              "https://cdn.dotaclassic.ru/public/upload/59144c9bb2185183ac95491d9b3fc38ff60379230544155c2fe500101ffd3ce8.webp"
            }
            description={t("meta_page.recordsDescription")}
            link={AppRouter.records.index.link}
          />
        </Carousel>
      </Section>

      <h2 className="grid6">{t("meta_page.lastMatches")}</h2>
      <Section className={"grid12"}>
        <MatchHistoryTable data={matches.data} loading={false} />
        <PageLink
          className={c.more}
          link={AppRouter.matches.index(0, MatchmakingMode.UNRANKED).link}
        >
          {t("meta_page.goToGameHistory")}
        </PageLink>
      </Section>
    </div>
  );
}

MetaPage.getInitialProps = async () => {
  return {
    matches: await getApi().matchApi.matchControllerMatches(
      0,
      10,
      MatchmakingMode.UNRANKED,
    ),
  };
};
