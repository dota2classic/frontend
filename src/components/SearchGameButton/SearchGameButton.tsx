import React, { ReactNode } from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import cx from "clsx";
import { formatBanReason } from "@/util/bans";
import { MatchmakingMode } from "@/api/mapped-models";

interface Props {
  visible: boolean;
  customContent?: ReactNode;
}
export const SearchGameButton = observer((p: Props) => {
  const { queue } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

  const isSearchModeDefined = !!queue.queueState;

  let content: ReactNode;

  if (queue.needAuth) return null;

  if (queue.selectedModeBanned && queue.partyBanStatus?.isBanned) {
    content = (
      <>
        Поиск запрещен:
        <div>{formatBanReason(queue.partyBanStatus!.status)}</div>
      </>
    );
  } else if (
    queue.selectedMode?.mode !== MatchmakingMode.BOTS &&
    queue.isNewbieParty
  ) {
    content = (
      <>
        Поиск запрещен:
        <div>
          Пройди <span className="gold">обучение</span>
        </div>
      </>
    );
  } else if (queue.isPartyInGame) {
    content = (
      <>
        Поиск запрещен:
        <div>Кто-то в группе играет</div>
      </>
    );
  }
  // else if (
  //   queue.selectedMode?.mode === MatchmakingMode.UNRANKED &&
  //   !queue.isUnrankedQueueOpen
  // ) {
  //   content = <>Поиск еще не открыт</>;
  // }

  if (!p.visible) return null;

  if (queue.needAuth)
    return (
      <a
        className={c.button}
        href={`${appApi.apiParams.basePath}/v1/auth/steam`}
        data-testid="floater-play-button-steam-login"
      >
        <FaSteam />
        Войти
      </a>
    );

  if (!queue.ready)
    return (
      <a data-testid="floater-play-button-loading" className={c.playButton}>
        Подключаемся...
      </a>
    );

  if (isSearchModeDefined)
    return (
      <button
        data-testid="floater-play-button-leave-queue"
        onClick={() => {
          queue.cancelSearch();
        }}
        className={cx(c.playButton, queue.gameState?.serverUrl && c.ingame)}
      >
        Отменить поиск
      </button>
    );

  if (!isSearchModeDefined) {
    return (
      <button
        data-testid="floater-play-button-enter-queue"
        disabled={!!content}
        onClick={() => {
          if (!isQueuePage) {
            router.push("/queue", "/queue").finally();
            return;
          }

          queue.enterQueue();
        }}
        className={cx(
          c.playButton,
          c.search,
          content && c.banned,
          queue.gameState?.serverUrl && c.ingame,
          content && c.longText,
        )}
      >
        {isQueuePage ? content || "Искать игру" : "Играть"}
      </button>
    );
  }

  return null;
});
