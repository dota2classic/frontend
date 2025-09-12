import React from "react";
import { observer } from "mobx-react-lite";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import { CarouselItem } from "@/components/CarouselItem";
import c from "../QueuePageBlock.module.scss";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const LastBlogBlock: React.FC = observer(({}) => {
  const { data } = getApi().blog.useBlogpostControllerBlogPage(0, 1);
  const post = data && data.data[0];
  const { t } = useTranslation();

  return (
    <QueuePageBlock title={t("queue_page.section.blog")}>
      {post ? (
        <CarouselItem
          link={AppRouter.blog.post(post.id).link}
          title={post.title}
          description={post.shortDescription}
          image={post.image.url}
          date={post.publishDate}
        />
      ) : (
        <div className={c.blockContentPlaceholder} />
      )}
    </QueuePageBlock>
  );
});
