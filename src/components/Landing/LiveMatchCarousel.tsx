import { getApi } from "@/api/hooks";
import c from "./Landing.module.scss";
import { AppRouter } from "@/route";
import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../Carousel";
import { SmallLiveMatch } from "../LiveMatchPreview";
import { LandingCarouselBlock } from "./LandingCarouselBlock";

export const LiveMatchCarousel = () => {
  const { t } = useTranslation();
  const { data } = getApi().liveApi.useLiveMatchControllerListMatches();

  if (!data || data.length === 0) return null;
  return (
    <LandingCarouselBlock
      title={t("live_match_carousel.liveMatches")}
      viewAllLink={AppRouter.live.link}
      viewAllLabel={t("live_match_carousel.viewAll")}
    >
      <Carousel>
        {data.map((t) => (
          <div key={t.matchId} className={c.liveMatchCarouselItem}>
            <SmallLiveMatch match={t} />
          </div>
        ))}
      </Carousel>
    </LandingCarouselBlock>
  );
};
