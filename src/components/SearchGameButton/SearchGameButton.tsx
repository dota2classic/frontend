import React, { ReactNode } from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import cx from "clsx";
import { formatBanReason } from "@/util/texts/bans";
import { Button } from "@/components";
import { getAuthUrl } from "@/util/getAuthUrl";
import {
  GameModeAccessLevel,
  getRequiredAccessLevel,
} from "@/const/game-mode-access-level";

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

  const requiredAccessLevel = queue.selectedMode
    ? getRequiredAccessLevel(queue.selectedMode.mode)
    : GameModeAccessLevel.EDUCATION;

  const partyAccessLevel = queue.partyAccessLevel;

  if (queue.selectedModeBanned && queue.partyBanStatus?.isBanned) {
    content = (
      <>
        Поиск запрещен:
        <div className={c.disableReason}>
          {formatBanReason(queue.partyBanStatus!.status)}
        </div>
      </>
    );
  } else if (partyAccessLevel < requiredAccessLevel) {
    if (requiredAccessLevel === GameModeAccessLevel.SIMPLE_MODES) {
      content = (
        <>
          Поиск запрещен:
          <div className={c.disableReason}>
            Пройди <span className="gold">обучение</span>
          </div>
        </>
      );
    } else if (requiredAccessLevel === GameModeAccessLevel.HUMAN_GAMES) {
      content = (
        <>
          Поиск запрещен:
          <div className={c.disableReason}>Победи в любом режиме</div>
        </>
      );
    } else if (queue.isPartyInGame) {
      content = (
        <>
          Поиск запрещен:
          <div className={c.disableReason}>Кто-то в группе играет</div>
        </>
      );
    }
  }

  if (!p.visible) return null;

  if (queue.needAuth)
    return (
      <Button
        mega
        href={getAuthUrl()}
        data-testid="floater-play-button-steam-login"
      >
        <FaSteam />
        Войти
      </Button>
    );

  if (!queue.ready)
    return (
      <Button mega data-testid="floater-play-button-loading">
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
