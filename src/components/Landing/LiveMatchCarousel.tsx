import { Carousel, PageLink, SmallLiveMatch } from "@/components";
import { getApi } from "@/api/hooks";
import c from "./Landing.module.scss";
import cx from "clsx";
import { AppRouter } from "@/route";
import React from "react";

export const LiveMatchCarousel = () => {
  const { data } = getApi().liveApi.useLiveMatchControllerListMatches();

  if (!data || data.length === 0) return null;
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>LIVE матчи</header>
        <PageLink link={AppRouter.live.link}>Посмотреть все</PageLink>
      </div>
      <Carousel>
        {data.map((t) => (
          <div key={t.matchId} className={c.liveMatchCarouselItem}>
            <SmallLiveMatch match={t} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};
