import { BlogpostDto } from "@/api/back";
import { AppRouter } from "@/route";
import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "../Carousel";
import { CarouselItem } from "../CarouselItem";
import { LandingCarouselBlock } from "./LandingCarouselBlock";

interface Props {
  recentPosts: BlogpostDto[];
}
export const RecentPostsCarousel: React.FC<Props> = ({ recentPosts }) => {
  const { t } = useTranslation();

  if (recentPosts.length === 0) return null;
  return (
    <LandingCarouselBlock
      title={t("recent_posts.news")}
      viewAllLink={AppRouter.blog.index.link}
      viewAllLabel={t("recent_posts.viewAll")}
    >
      <Carousel>
        {recentPosts.map((it) => (
          <CarouselItem
            key={it.id}
            link={AppRouter.blog.post(it.id).link}
            title={it.title}
            description={it.shortDescription}
            image={it.image.url}
            date={it.publishDate}
          />
        ))}
      </Carousel>
    </LandingCarouselBlock>
  );
};
