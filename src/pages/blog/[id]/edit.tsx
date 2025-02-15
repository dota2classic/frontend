import { BlogEditContainer } from "@/containers";
import { getApi } from "@/api/hooks";
import { BlogpostDto } from "@/api/back";
import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { formatDate } from "@/util/dates";

interface Props {
  post: BlogpostDto;
}

export default function EditBlog({ post }: Props) {
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
    post: await withTemporaryToken(ctx, () =>
      getApi().blog.blogpostControllerGetBlogpostDraft(id),
    ),
  };
};
