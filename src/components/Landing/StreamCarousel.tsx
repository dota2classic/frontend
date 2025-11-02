import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import React from "react";
import { TwitchStreamDto } from "@/api/back";
import { AppRouter } from "@/route";
import { getDomain } from "@/util/domain";
import { useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";

interface Props {
  streamList: TwitchStreamDto[];
}
export const StreamCarousel = ({ streamList }: Props) => {
  const { t } = useTranslation();
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <PageLink link={AppRouter.streams.link}>
          <header>{t("stream_carousel.streams")}</header>
        </PageLink>
      </div>

      <div className={c.streamCarousel}>
        {streamList.map((stream, idx) => (
          <div className={c.streamWrapper} key={stream.link}>
            <iframe
              src={`https://player.twitch.tv/?channel=${stream.link.split("twitch.tv/")[1]}&parent=${getDomain()}&muted=true&autoplay=${idx < 2}`}
              allowFullScreen={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
