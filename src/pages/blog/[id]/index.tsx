import { getApi } from "@/api/hooks";
import { BlogpostDto, ThreadType } from "@/api/back";
import c from "./BlogpostPage.module.scss";
import { NextPageContext } from "next";
import { BlogpostRenderer, EmbedProps, PageLink } from "@/components";
import React from "react";
import { formatDate } from "@/util/dates";
import { AppRouter } from "@/route";
import { FaArrowLeft } from "react-icons/fa";
import { LazyPaginatedThread } from "@/containers/Thread/LazyPaginatedThread";
import { useTranslation } from "react-i18next";

interface Props {
  post: BlogpostDto;
}
export default function BlogpostPage({ post }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps title={post.title} description={post.shortDescription} />
      <div className={c.postContainer}>
        <PageLink link={AppRouter.blog.index.link} className={c.newsLink}>
          <FaArrowLeft /> {t("blogpostPage.allNews")}
        </PageLink>
        <h1 className={c.title}>{post.title}</h1>
        <h4 className={c.date}>{formatDate(new Date(post.publishDate))}</h4>
        <BlogpostRenderer html={post.renderedContentHtml} />
        <LazyPaginatedThread
          className={c.thread}
          id={post.id.toString()}
          threadType={ThreadType.BLOGPOST}
        />
      </div>
    </>
  );
}

BlogpostPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const id = Number(ctx.query.id as string);

  return {
    post: await getApi().blog.blogpostControllerGetBlogpost(id),
  };
};
