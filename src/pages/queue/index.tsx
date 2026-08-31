import React from "react";
import { NewQueuePage } from "@/containers/NewQueuePage/NewQueuePage";
import { NextPageContext } from "next";
import { MatchmakingMode } from "@/api/mapped-models";
import { MatchmakingInfo, PartyDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { redirectToPage } from "@/util/redirectToPage";
import { getApi } from "@/api/hooks";
import { QueueStore } from "@/store/queue/QueueStore";
import Cookies from "cookies";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { BrowserCookies } from "@/util/browser-cookies";

interface Props {
  modes: MatchmakingInfo[];

  "@party"?: PartyDto;
  "@defaultModes": MatchmakingMode[];
}

export default function QueuePage({ modes }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <EmbedProps
        title={t("queue_page.seo.title")}
        description={t("queue_page.seo.description")}
      />
      <NewQueuePage modes={modes} />
    </>
  );
}

QueuePage.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const jwt = withTemporaryToken(ctx, (store) => store.auth.parsedToken);
  if (!jwt) {
    await redirectToPage(ctx, "/download");
    return { modes: [], "@defaultModes": [] };
  }

  const [modes, party] = await Promise.combine([
    getApi().statsApi.statsControllerGetMatchmakingInfo(),
    withTemporaryToken(ctx, () => {
      return getApi().playerApi.playerControllerMyParty();
    }),
  ]);

  let defaultModes: MatchmakingMode[] = [];
  if (typeof window === "undefined") {
    const cookies = new Cookies(ctx.req!, ctx.res!);
    defaultModes = QueueStore.inferDefaultMode(
      (key) => cookies.get(key) || null,
      party,
    );
  } else {
    defaultModes = QueueStore.inferDefaultMode(
      (key) => BrowserCookies.get(key) || null,
      party,
    );
  }

  return {
    modes,
    "@party": party,
    "@defaultModes": defaultModes,
  };
};
