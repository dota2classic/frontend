import React from "react";

import c from "./NewQueuePage.module.scss";
import cx from "clsx";
import { PlayingNowCarousel } from "@/containers/PlayingNowCarousel";
import { observer } from "mobx-react-lite";
import { LastBlogBlock } from "@/containers/QueuePageBlock/LastBlogBlock";
import { PartyInfo } from "@/containers/QueuePageBlock/PartyInfo";
import { QueueModeList } from "@/containers/QueuePageBlock/QueueModeList";
import { MatchmakingInfo } from "@/api/back";
import { QueueChatBlock } from "@/containers/QueuePageBlock/QueueChatBlock";
import { QueueAdBlock } from "@/containers/QueuePageBlock/QueueAdBlock";
import { SearchGameBlock } from "@/containers/QueuePageBlock/SearchGameBlock";
import { QueueTutorial } from "@/containers/NewQueuePage/QueueTutorial";

interface Props {
  modes: MatchmakingInfo[];
}
export const NewQueuePage: React.FC<Props> = observer(({ modes }) => {
  return (
    <>
      <QueueTutorial />
      <div className={cx(c.layout)}>
        <div className={cx(c.left)}>
          <LastBlogBlock />
          <PlayingNowCarousel />
        </div>
        <div className={cx(c.center)}>
          <QueueAdBlock />
          <QueueChatBlock />
        </div>
        <div className={cx(c.right)}>
          <PartyInfo />
          <QueueModeList modes={modes} />
          <SearchGameBlock />
        </div>
      </div>
    </>
  );
});
