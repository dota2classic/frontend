import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import { PageLink } from "@/components";
import React from "react";
import { TwitchStreamDto } from "@/api/back";
import { AppRouter } from "@/route";
import { getDomain } from "@/util/domain";

interface Props {
  streamList: TwitchStreamDto[];
}
export const StreamCarousel = ({ streamList }: Props) => {
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <PageLink link={AppRouter.streams.link}>
          <header>Стримы</header>
        </PageLink>
      </div>

      <div className={c.streamCarousel}>
        {streamList.map((stream, idx) => (
          <div className={c.streamWrapper} key={stream.link}>
            <iframe
              src={`https://player.twitch.tv/?channel=${stream.link.split("twitch.tv/")[1]}&parent=${getDomain()}&muted=true&autoplay=${idx < 2}`}
              allowFullScreen={false}
            />
          </div>
          // <CarouselItem
          //   unoptimized
          //   badge={stream.viewers}
          //   link={stream.link}
          //   key={stream.user.steamId}
          //   image={stream.preview}
          //   title={
          //     <UserPreview
          //       user={{
          //         ...stream.user,
          //         name: `Стрим ${stream.user.name}`,
          //       }}
          //     />
          //   }
          //   description={stream.title}
          // />
        ))}
      </div>
    </div>
  );
};
