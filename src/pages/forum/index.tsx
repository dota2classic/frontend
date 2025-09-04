import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { ThreadPageDTO, ThreadType } from "@/api/back";
import c from "./Forum.module.scss";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { ForumTabs } from "@/containers/ForumTabs";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { Pagination } from "@/components/Pagination";
import { ThreadsTable } from "@/components/ThreadsTable";
import { Button } from "@/components/Button";

interface Props {
  threads: ThreadPageDTO;
  page: number;
}

export default function ForumIndexPage({ threads, page }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("forum.seo.title")}
        description={t("forum.seo.description")}
      />

      <div className={c.buttons}>
        <ForumTabs />
        <PageLink
          link={AppRouter.forum.createThread(ThreadType.FORUM).link}
          className={c.createThread}
        >
          <Button>{t("forum.newThread")}</Button>
        </PageLink>
      </div>
      {threads.pages > 1 && (
        <Pagination
          page={page}
          maxPage={threads.pages}
          linkProducer={(page) => AppRouter.forum.index(page).link}
        />
      )}
      <ThreadsTable threads={threads} />
    </>
  );
}

ForumIndexPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  const threads = await getApi().forumApi.forumControllerThreads(
    page,
    false,
    15,
    ThreadType.FORUM,
  );

  return {
    threads,
    page,
  };
};
