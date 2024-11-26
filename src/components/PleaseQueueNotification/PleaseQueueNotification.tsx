import React from "react";

import { PageLink } from "..";

import c from "./PleaseQueueNotification.module.scss";
import { MatchmakingMode } from "@/api/mapped-models";
import { formatGameMode } from "@/util/gamemode";
import { AppRouter } from "@/route";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

interface IPleaseQueueNotificationProps {
  mode: MatchmakingMode;
  inQueue: number;
}

export const PleaseQueueNotification: React.FC<IPleaseQueueNotificationProps> =
  observer(({ mode, inQueue }) => {
    const { notify } = useStore();
    return (
      <div className={c.notification}>
        <header>
          Давай поиграем в <br />
          <span className="gold">{formatGameMode(mode)}</span>?
        </header>
        <h3>Там уже {inQueue} в поиске!</h3>

        <div className={c.buttons}>
          <PageLink
            className={c.accept}
            link={AppRouter.queue.link}
            onClick={notify.closeCurrent}
          >
            Уже иду
          </PageLink>
          <button className={c.decline} onClick={notify.closeCurrent}>
            Потом
          </button>
        </div>
      </div>
    );
  });
