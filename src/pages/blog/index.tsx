import { Rubik } from "next/font/google";
import { BlogPageDto } from "@/api/back";
import c from "./Blog.module.scss";
import cx from "clsx";
import {CarouselItem, EmbedProps} from "@/components";
import { AppRouter } from "@/route";
import { NextPageContext } from "next";
import { numberOrDefault } from "@/util/urls";
import { getApi } from "@/api/hooks";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import React from "react";
import { useIsModerator } from "@/util";

const threadFont = Rubik({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface Props {
  page: BlogPageDto;
}

export default function NewsList({ page }: Props) {
  const isMod = useIsModerator();
  return (
    <>
      <EmbedProps title={"Новости проекта"} description={"Последние новости проекта dota 2 classic"} />
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.blog.index.link}>Новости</PageLink>
          </Breadcrumbs>
        </div>
        <div className="right">
          {isMod && (
            <dl>
              <dd>
                <PageLink link={AppRouter.blog.create.link}>
                  Создать новость
                </PageLink>
              </dd>
              <dt></dt>
            </dl>
          )}
        </div>
      </Panel>
      <div className={cx(threadFont.className, c.posts)}>
        {page.data.map((post) => (
          <CarouselItem
            key={post.id}
            title={post.title}
            image={post.image.url}
            link={AppRouter.blog.post(post.id).link}
            description={post.shortDescription}
            date={post.publishDate}
          />
        ))}
      </div>
    </>
  );
}

NewsList.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  // Add the "await" keyword like this:
  const page = numberOrDefault(ctx.query.page as string, 0);

  return {
    page: await getApi().blog.blogpostControllerBlogPage(page),
  };
};
