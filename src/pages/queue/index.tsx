import React from "react";
import { NewQueuePage } from "@/containers/NewQueuePage/NewQueuePage";
import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { redirectToPage } from "@/util/redirectToPage";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

export default function QueuePage() {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("queue_page.seo.title")}
        description={t("queue_page.seo.description")}
      />
      <NewQueuePage />
    </>
  );
}

QueuePage.getInitialProps = async (ctx: NextPageContext) => {
  const jwt = withTemporaryToken(ctx, (store) => store.auth.parsedToken);
  if (!jwt) {
    await redirectToPage(ctx, "/download");
  }

  return {};
};
