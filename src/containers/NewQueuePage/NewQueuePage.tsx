import React, { useState } from "react";

import c from "./NewQueuePage.module.scss";
import cx from "clsx";
import { PlayingNowCarousel } from "@/containers/PlayingNowCarousel";
import { observer } from "mobx-react-lite";
import { PartyInfo } from "@/containers/QueuePageBlock/PartyInfo";
import { QueueModeList } from "@/containers/QueuePageBlock/QueueModeList";
import { MatchmakingInfo } from "@/api/back";
import { QueueChatBlock } from "@/containers/QueuePageBlock/QueueChatBlock";
import { QueueAdBlock } from "@/containers/QueuePageBlock/QueueAdBlock";
import { SearchGameBlock } from "@/containers/QueuePageBlock/SearchGameBlock";
import { QueueTutorial } from "@/containers/NewQueuePage/QueueTutorial";
import { useTranslation } from "react-i18next";
import { BigTabs } from "@/components/BigTabs";
import { LastBlogBlock } from "@/containers/QueuePageBlock/LastBlogBlock";

interface Props {
  modes: MatchmakingInfo[];
}

type Tabs = "news" | "chat" | "modes";

export const NewQueuePage: React.FC<Props> = observer(({ modes }) => {
  const [tab, setTab] = useState<Tabs>("modes");
  const { t } = useTranslation();
  return (
    <>
      <QueueTutorial />
      <BigTabs<Tabs>
        className={c.mobile__tabs}
        flavor="small"
        selected={tab}
        items={[
          {
            key: "modes",
            label: t("queue_page.bigTabs.play"),
            onSelect: setTab,
          },
          {
            key: "chat",
            label: t("queue_page.bigTabs.chat"),
            onSelect: setTab,
          },
          {
            key: "news",
            label: t("queue_page.bigTabs.news"),
            onSelect: setTab,
          },
        ]}
      />
      <div className={cx(c.layout)}>
        <div className={cx(c.left, tab !== "news" && c.mobile_hidden)}>
          <LastBlogBlock />
          <PlayingNowCarousel />
        </div>
        <div className={cx(c.center, tab !== "chat" && c.mobile_hidden)}>
          <QueueAdBlock />
          <QueueChatBlock />
        </div>
        <div className={cx(c.right, tab !== "modes" && c.mobile_hidden)}>
          <PartyInfo />
          <QueueModeList modes={modes} />
          <SearchGameBlock />
        </div>
      </div>
    </>
  );
});
