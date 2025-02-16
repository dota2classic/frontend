import { BlogpostDto } from "@/api/back";
import { Carousel, CarouselItem, PageLink } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";

interface Props {
  recentPosts: BlogpostDto[];
}
export const RecentPostsCarousel: React.FC<Props> = ({ recentPosts }) => {
  if (recentPosts.length === 0) return null;
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>Новости</header>
        <PageLink link={AppRouter.index.link}>Посмотреть все</PageLink>
      </div>
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
    </div>
  );
};
