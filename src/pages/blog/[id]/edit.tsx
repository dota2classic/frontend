import { BlogEditContainer } from "@/containers/BlogEditContainer";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";
import { Panel } from "@/components/Panel";
import { AppRouter } from "@/route";
import React from "react";
import { formatDate } from "@/util/dates";
import { useTranslation } from "react-i18next";

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
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.blog.index.link}>
              {t("edit_blog.news")}
            </PageLink>
            <span>{t("edit_blog.editing", { title: post.title })}</span>
          </Breadcrumbs>
        </div>
        <div className="right">
          <dl>
            <dd>
              {post.published ? t("edit_blog.published") : t("edit_blog.draft")}
            </dd>
            <dt>{t("edit_blog.status")}</dt>
          </dl>

          <dl>
            <dd>
              {post.publishDate
                ? formatDate(new Date(post.publishDate))
                : t("edit_blog.notPublished")}
            </dd>
            <dt>{t("edit_blog.publishDate")}</dt>
          </dl>
        </div>
      </Panel>
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
