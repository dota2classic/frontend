import React, { useState } from "react";

import c from "./NewQueuePage.module.scss";
import cx from "clsx";
import { PlayingNowCarousel } from "@/containers/PlayingNowCarousel";
import { observer } from "mobx-react-lite";
import { QueueChatBlock } from "@/containers/QueuePageBlock/QueueChatBlock";
import { QueueAdBlock } from "@/containers/QueuePageBlock/QueueAdBlock";
import { QueueTutorial } from "@/containers/NewQueuePage/QueueTutorial";
import { useTranslation } from "react-i18next";
import { BigTabs } from "@/components/BigTabs";
import { DailyMatchRecordCarousel } from "@/containers/QueuePageBlock/DailyMatchRecordCarousel";
import { LauncherPromotionBlock } from "@/containers/QueuePageBlock/LauncherPromotionBlock";

type Tabs = "news" | "chat" | "modes";

export const NewQueuePage: React.FC = observer(() => {
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
          <QueueAdBlock />
          <DailyMatchRecordCarousel />
          {/*<LastBlogBlock />*/}
          <PlayingNowCarousel />
        </div>
        <div className={cx(c.center, tab !== "chat" && c.mobile_hidden)}>
          <QueueChatBlock />
        </div>
        <div className={cx(c.right, tab !== "modes" && c.mobile_hidden)}>
          <LauncherPromotionBlock />
        </div>
      </div>
    </>
  );
});
