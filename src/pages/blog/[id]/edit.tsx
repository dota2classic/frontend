import { BlogEditContainer } from "@/containers";
import { getApi } from "@/api/hooks";
import { NextPageContext } from "next";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { formatDate } from "@/util/dates";

interface Props {
  id: number;
}

export default function EditBlog({ id }: Props) {
  const { data: post, isLoading } =
    getApi().blog.useBlogpostControllerGetBlogpostDraft(id);

  if (!post) {
    return isLoading ? <h1>Loading</h1> : <h1>...</h1>;
  }
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.blog.index.link}>Новости</PageLink>
            <span>Редактирование {post.title}</span>
          </Breadcrumbs>
        </div>
        <div className="right">
          <dl>
            <dd>{post.published ? "Опубликован" : "Драфт"}</dd>
            <dt>Статус</dt>
          </dl>

          <dl>
            <dd>
              {post.publishDate
                ? formatDate(new Date(post.publishDate))
                : "Еще не опубликован"}
            </dd>
            <dt>Дата публикации</dt>
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
