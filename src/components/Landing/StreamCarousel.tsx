import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import { Carousel, CarouselItem, UserPreview } from "@/components";
import React from "react";
import { TwitchStreamDto } from "@/api/back";

interface Props {
  streamList: TwitchStreamDto[];
}
export const StreamCarousel = ({ streamList }: Props) => {
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>Стримы</header>
      </div>

      <Carousel>
        {streamList.map((stream) => (
          <CarouselItem
            badge={stream.viewers}
            link={stream.link}
            key={stream.user.steamId}
            image={stream.preview}
            title={
              <UserPreview
                user={{
                  ...stream.user,
                  name: `Стрим ${stream.user.name}`,
                }}
              />
            }
            description={stream.title}
          />
        ))}
      </Carousel>
    </div>
  );
};
