import {
  Carousel,
  CarouselItem,
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

interface Props {
  matches: MatchPageDto;
}

export default function MetaPage({ matches }: Props) {
  return (
    <div className={cx("grid", c.grid)}>
      <h2 className="grid6">Мета</h2>
      <Section className={"grid12"}>
        <Carousel gridCnt={2}>
          <CarouselItem
            title={"Сильнейшие предметы"}
            image={
              "https://s3.dotaclassic.ru/public/upload/9f03797a85c098fc5496d248e6bb011fe67a516afa63dc48c75eaf181ef49212.webp"
            }
            description={
              "Подробная статистика и описание всех предметов нашего патча"
            }
            link={AppRouter.items.index.link}
          />

          <CarouselItem
            title={"Метовые герои"}
            image={
              "https://s3.dotaclassic.ru/public/upload/c56591b5a79d7ff50e5044c0282867986aaca67c31119efeecf71fe03bfaecf5.webp"
            }
            description={
              "Самые сильные и слабые герои патча, их статистика и лучшие игроки"
            }
            link={AppRouter.heroes.index.link}
          />
        </Carousel>
      </Section>

      <h2 className="grid6">Достижения</h2>
      <Section className={"grid12"}>
        <Carousel gridCnt={2}>
          <CarouselItem
            title={"Таблица лидеров"}
            image={"/landing/leaderboard.webp"}
            description={"Сильнейшие игроки за все время и за сезон"}
            link={AppRouter.players.leaderboard().link}
          />

          <CarouselItem
            title={"Рекорды"}
            image={
              "https://s3.dotaclassic.ru/public/upload/59144c9bb2185183ac95491d9b3fc38ff60379230544155c2fe500101ffd3ce8.webp"
            }
            description={"Поставленнные рекорды за месяц, сезон и все время"}
            link={AppRouter.records.index.link}
          />
        </Carousel>
      </Section>

      <h2 className="grid6">Последние матчи</h2>
      <Section className={"grid12"}>
        <MatchHistoryTable data={matches.data} loading={false} />
        <PageLink
          className={c.more}
          link={AppRouter.matches.index(0, MatchmakingMode.UNRANKED).link}
        >
          Перейти к истории игр
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
