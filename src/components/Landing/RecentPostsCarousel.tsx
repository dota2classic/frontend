import { BlogpostDto } from "@/api/back";
import { AppRouter } from "@/route";
import React from "react";
import cx from "clsx";
import c from "@/components/Landing/Landing.module.scss";
import { useTranslation } from "react-i18next";
import { PageLink } from "../PageLink";
import { Carousel } from "../Carousel";
import { CarouselItem } from "../CarouselItem";

interface Props {
  recentPosts: BlogpostDto[];
}
export const RecentPostsCarousel: React.FC<Props> = ({ recentPosts }) => {
  const { t } = useTranslation();

  if (recentPosts.length === 0) return null;
  return (
    <div className={cx(c.carouselBlock, c.middleBlock)}>
      <div className={c.newsMore}>
        <header>{t("recent_posts.news")}</header>
        <PageLink link={AppRouter.blog.index.link}>
          {t("recent_posts.viewAll")}
        </PageLink>
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
