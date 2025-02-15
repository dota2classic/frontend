import { getApi } from "@/api/hooks";
import {
  BlogpostDto,
  ThreadDTO,
  ThreadMessagePageDTO,
  ThreadType,
} from "@/api/back";
import { RichPageRender } from "@/containers/RichEditor/RichPageRender";
import c from "./BlogpostPage.module.scss";
import { NextPageContext } from "next";
import { formatDate } from "@/util/dates";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { Thread } from "@/containers";
import { ThreadStyle } from "@/containers/Thread/types";
import { useIsModerator } from "@/util";

interface Props {
  post: BlogpostDto;
  messages: ThreadMessagePageDTO;
  thread: ThreadDTO;
}
export default function BlogpostPage({ post, messages }: Props) {
  const isMod = useIsModerator();
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.blog.index.link}>Новости</PageLink>
            <span>{post.title}</span>
          </Breadcrumbs>
        </div>
        <div className="right">
          {isMod && (
            <dl>
              <dd>
                <PageLink link={AppRouter.blog.post(post.id, true).link}>
                  Редактировать
                </PageLink>
              </dd>
              <dt>Действие</dt>
            </dl>
          )}
        </div>
      </Panel>
      <Panel className={c.post}>
        <h1 className={c.title}>{post.title}</h1>
        <h4 className={c.date}>{formatDate(new Date(post.publishDate))}</h4>
        <RichPageRender state={post.content} />
      </Panel>
      <Thread
        className={c.thread}
        threadStyle={ThreadStyle.FORUM}
        id={post.id.toString()}
        threadType={ThreadType.BLOGPOST}
        showLastMessages={100}
        populateMessages={messages}
      />
    </>
  );
}

BlogpostPage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const id = Number(ctx.query.id as string);

  return {
    post: await getApi().blog.blogpostControllerGetBlogpost(id),
    messages: await getApi().forumApi.forumControllerGetLatestPage(
      id.toString(),
      ThreadType.BLOGPOST,
      100,
    ),
    thread: await getApi().forumApi.forumControllerGetThread(
      id.toString(),
      ThreadType.BLOGPOST,
    ),
  };
};
