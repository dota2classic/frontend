import React from "react";
import { observer } from "mobx-react-lite";
import c from "./AcceptGameModal.module.scss";
import cx from "clsx";
import { GameReadyModal } from "@/components";
import { useStore } from "@/store";
import { formatGameMode } from "@/util/gamemode";
import { useRouter } from "next/router";

export const AcceptGameModal = observer(() => {
  const qStore = useStore().queue;
  const q = qStore;

  const router = useRouter();
  const isQueuePage = router.pathname === "/queue";

  if (q.isSearchingServer)
    return (
      <div className={c.modalWrapper}>
        <div className={c.modal}>
          <h2>Идет поиск сервера...</h2>
        </div>
      </div>
    );

  if (q.gameInfo?.serverURL) {
    if (!isQueuePage)
      return <GameReadyModal className={cx(c.modal, c.inline)} />;
    return null;
  }

  if (!q.gameInfo) return null;

  if (!q.gameInfo.iAccepted)
    return (
      <div className={c.modalWrapper}>
        <div className={c.modal}>
          <div className={c.header}>
            <h4>Ваша игра готова</h4>
            <h3>{formatGameMode(q.gameInfo.mode)}</h3>
          </div>
          <div className={c.buttons}>
            <button
              className={cx(c.button2, c.accept)}
              onClick={qStore.acceptGame}
            >
              Принять
            </button>
            <button
              className={cx(c.button2, c.decline)}
              onClick={qStore.declineGame}
            >
              Отклонить
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className={c.modalWrapper}>
      <div className={c.modal}>
        <div className={c.header}>
          <h4>Ожидаем остальных игроков</h4>
          <h3>
            {q.gameInfo?.accepted === undefined ? 0 : q.gameInfo!.accepted} из{" "}
            {q.gameInfo.total}...
          </h3>
        </div>
        <div className={c.dots}>
          {new Array(q.gameInfo.total).fill(null).map((_, t) => (
            <div
              key={t}
              className={t < q.gameInfo!.accepted ? c.acceptedDot : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
