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
import { formatGameMode } from "@/util/gamemode";
import { PeriodicDurationTimerClient } from "@/components/PeriodicTimer/PeriodicDurationTimerClient";
import { pluralize } from "@/util/pluralize";

interface Props {
  visible: boolean;
  customContent?: ReactNode;
}
export const SearchGameButton = observer((p: Props) => {
  const { queue } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

  const isInQueue = queue.queueState?.inQueue;

  let content: ReactNode;

  if (queue.needAuth) return null;

  // const requiredAccessLevel = queue.selectedMode
  //   ? getRequiredAccessLevel(queue.selectedMode.mode)
  //   : GameModeAccessLevel.EDUCATION;

  // const partyAccessLevel = queue.partyAccessLevel;

  if (queue.partyBanStatus?.isBanned) {
    content = (
      <>
        Поиск запрещен:
        <div className={c.disableReason}>
          {formatBanReason(queue.partyBanStatus!.status)}
        </div>
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
      <Button
        className="onboarding-queue-button"
        mega
        data-testid="floater-play-button-loading"
      >
        Подключаемся...
      </Button>
    );

  if (isInQueue) {
    const searchedModes = queue.queueState?.modes || [];
    const searchGameInfo =
      searchedModes.length > 1
        ? `${searchedModes.length} ${pluralize(searchedModes.length, "режим", "режима", "режимов")}`
        : searchedModes.map(formatGameMode).join(", ");
    return (
      <Button
        mega
        data-testid="floater-play-button-leave-queue"
        onClick={() => {
          queue.cancelSearch();
        }}
        className={cx(
          queue.gameState?.serverUrl && c.ingame,
          "onboarding-queue-button",
          c.button,
        )}
      >
        <div>Отменить поиск</div>

        <div className={c.searchAdditional}>
          <span className={c.searchAdditional__modes}>{searchGameInfo}</span>
          {queue.party?.enterQueueAt && (
            <span className={c.searchTimer}>
              <PeriodicDurationTimerClient
                startTime={queue.party.enterQueueAt}
              />
            </span>
          )}
        </div>
      </Button>
    );
  }
  if (!isInQueue) {
    const shouldDisable =
      (isQueuePage && queue.selectedModes.length === 0) || !!content;
    return (
      <Button
        mega
        data-testid="floater-play-button-enter-queue"
        disabled={shouldDisable}
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
          "onboarding-queue-button",
        )}
      >
        {isQueuePage ? content || "Искать игру" : "Играть"}
      </Button>
    );
  }

  return null;
});
