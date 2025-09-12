import { observer } from "mobx-react-lite";
import { QueueGameState, useQueueState } from "@/util/useQueueState";
import { SearchGameButton } from "@/components/SearchGameButton";
import {
  GameReadyModal,
  ServerSearching,
  WaitingAccept,
} from "@/components/AcceptGameModal";
import c from "@/containers/NewQueuePage/NewQueuePage.module.scss";
import React from "react";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const SearchGameBlock = observer(() => {
  const queueGameState = useQueueState();
  return (
    <QueuePageBlock>
      {queueGameState === QueueGameState.NO_GAME && (
        <SearchGameButton visible={true} />
      )}
      {queueGameState === QueueGameState.SERVER_READY && (
        <GameReadyModal className={c.gameReady} />
      )}
      {queueGameState === QueueGameState.READY_CHECK_WAITING_OTHER && (
        <WaitingAccept className={c.gameReady} />
      )}
      {queueGameState === QueueGameState.SEARCHING_SERVER && (
        <ServerSearching className={c.gameReady} />
      )}
    </QueuePageBlock>
  );
});
