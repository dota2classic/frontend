import React from "react";
import { observer } from "mobx-react-lite";
import c from "./AcceptGameModal.module.scss";
import cx from "clsx";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { WaitingAccept } from "./WaitingAccept";
import { QueueGameState, useQueueState } from "@/util/useQueueState";
import { ServerSearching } from "./ServerSearching";
import { useTranslation } from "react-i18next";
import { GameReadyModal } from "./GameReadyModal";

export const AcceptGameModal = observer(() => {
  const { t } = useTranslation();
  const { queue } = useStore();

  const router = useRouter();
  const isQueuePage = router.pathname === "/queue";

  const queueGameState = useQueueState();

  // First, display things we should always display

  if (queueGameState === QueueGameState.READY_CHECK_WAITING_USER) {
    return (
      <div className={c.modalWrapper} data-testid="accept-modal-waiting-user">
        <div className={c.modal}>
          <div className={c.header}>
            <h4>{t("accept_game_modal.yourGameReady")}</h4>
            <h3>{t(`matchmaking_mode.${queue.roomState!.mode}`)}</h3>
          </div>
          <div className={c.buttons}>
            <button
              className={cx(c.button2, c.accept)}
              onClick={queue.acceptGame}
            >
              {t("accept_game_modal.accept")}
            </button>
            <button
              className={cx(c.button2, c.decline)}
              onClick={queue.declineGame}
            >
              {t("accept_game_modal.decline")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show nothing on queue page, only accept big modal
  if (isQueuePage) return null;

  if (queueGameState === QueueGameState.SEARCHING_SERVER)
    return <ServerSearching className={cx(c.nonPrimaryModal)} />;
  else if (queueGameState === QueueGameState.READY_CHECK_WAITING_OTHER) {
    return <WaitingAccept className={cx(c.nonPrimaryModal, c.dots__modal)} />;
  } else if (queueGameState === QueueGameState.SERVER_READY) {
    return <GameReadyModal className={cx(c.modal, c.inline)} />;
  }
});
