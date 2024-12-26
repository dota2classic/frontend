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
import { Button } from "@/components";

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

  if (!p.visible) return null;

  if (queue.needAuth)
    return (
      <Button
        mega
        href={`${appApi.apiParams.basePath}/v1/auth/steam`}
        data-testid="floater-play-button-steam-login"
      >
        <FaSteam />
        Войти
      </Button>
    );

  if (!queue.ready)
    return (
      <Button
        mega
        data-testid="floater-play-button-loading"
      >
        Подключаемся...
      </Button>
    );

  if (isSearchModeDefined)
    return (
      <Button
        mega
        data-testid="floater-play-button-leave-queue"
        onClick={() => {
          queue.cancelSearch();
        }}
        className={cx(queue.gameState?.serverUrl && c.ingame)}
      >
        Отменить поиск
      </Button>
    );

  if (!isSearchModeDefined) {
    return (
      <Button
        mega
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
          content && c.banned,
          queue.gameState?.serverUrl && c.ingame,
          content && c.longText,
        )}
      >
        {isQueuePage ? content || "Искать игру" : "Играть"}
      </Button>
    );
  }

  return null;
});
