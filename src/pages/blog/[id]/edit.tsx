import { BlogEditContainer } from "@/containers/BlogEditContainer";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import React from "react";
import { formatDate } from "@/util/dates";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { MetaStat } from "@/components/MetaStat";

interface Props {
  id: number;
}

export default function EditBlog({ id }: Props) {
  const { data: post, isLoading } =
    getApi().blog.useBlogpostControllerGetBlogpostDraft(id);
  const { t } = useTranslation();

  if (!post) {
    return isLoading ? (
      <h1>{t("edit_blog.loading")}</h1>
    ) : (
      <h1>{t("edit_blog.loadingError")}</h1>
    );
  }
  return (
    <>
      <PageHeader
        breadcrumbs={
          <>
            <PageLink link={AppRouter.blog.index.link}>
              {t("edit_blog.news")}
            </PageLink>
            <span>{t("edit_blog.editing", { title: post.title })}</span>
          </>
        }
        actions={
          <>
            <MetaStat
              label={t("edit_blog.status")}
              value={
                post.published ? t("edit_blog.published") : t("edit_blog.draft")
              }
            />
            <MetaStat
              label={t("edit_blog.publishDate")}
              value={
                post.publishDate
                  ? formatDate(new Date(post.publishDate))
                  : t("edit_blog.notPublished")
              }
            />
          </>
        }
      />
      <BlogEditContainer post={post} />
    </>
  );
}

EditBlog.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const id = Number(ctx.query.id as string);

  return {
    id,
  };
};
