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
import { PeriodicDurationTimerClient } from "@/components/PeriodicTimer/PeriodicDurationTimerClient";
import { pluralize } from "@/util/pluralize";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  customContent?: ReactNode;
}
export const SearchGameButton = observer((p: Props) => {
  const { t } = useTranslation();
  const { queue } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";
  const isLobbyPage = router.pathname.startsWith("/lobby/");

  const isInQueue = queue.queueState?.inQueue;

  const isPartyInLobby = queue.isPartyInLobby;
  const myLobby = queue.myLobbyId;

  let content: ReactNode;

  if (queue.needAuth) return null;

  if (
    queue.partyBanStatus?.isBanned &&
    new Date(queue.partyBanStatus!.bannedUntil).getTime() >
      Date.now() + 1000 * 60 * 60 * 24 * 365
  ) {
    content = (
      <>
        {t("search_game_button.searchForbidden")}:
        <div className={c.disableReason}>
          {formatBanReason(queue.partyBanStatus!.status)}
        </div>
      </>
    );
  } else if (queue.isPartyInGame) {
    content = (
      <>
        {t("search_game_button.searchForbidden")}:
        <div className={c.disableReason}>
          {t("search_game_button.someoneInGame")}
        </div>
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
        {t("search_game_button.login")}
      </Button>
    );

  if (!queue.ready)
    return (
      <Button
        className="onboarding-queue-button"
        mega
        data-testid="floater-play-button-loading"
      >
        {t("search_game_button.connecting")}
      </Button>
    );

  // Hide button in lobby
  if (isLobbyPage) {
    return null;
  }

  if (isPartyInLobby) {
    if (myLobby) {
      return (
        <Button
          mega
          data-testid="floater-play-button-enter-queue"
          onClick={() => {
            if (!isLobbyPage) {
              router.push("/lobby/[id]", `/lobby/${myLobby}`).finally();
              return;
            }
          }}
          className={cx(
            queue.gameState?.serverUrl && c.ingame,
            "onboarding-queue-button",
          )}
        >
          {t("search_game_button.returnToLobby")}
        </Button>
      );
    } else {
      const anyLobby = queue.party
        ? queue.party.players.find((t) => t.lobbyId)?.lobbyId
        : undefined;
      return (
        <Button
          mega
          data-testid="floater-play-button-enter-queue"
          onClick={() => {
            if (!isLobbyPage) {
              router.push("/lobby/[id]", `/lobby/${anyLobby}`).finally();
              return;
            }
          }}
          className={cx(
            queue.gameState?.serverUrl && c.ingame,
            c.longText,
            "onboarding-queue-button",
          )}
        >
          {t("search_game_button.groupInLobby")}
          <div className={c.searchAdditional}>
            <span className={c.searchAdditional__modes}>
              {t("search_game_button.joinLobby")}
            </span>
          </div>
        </Button>
      );
    }
  }

  if (isInQueue) {
    const searchedModes = queue.queueState?.modes || [];
    const searchGameInfo =
      searchedModes.length > 1
        ? `${searchedModes.length} ${pluralize(searchedModes.length, t("search_game_button.modeSingular"), t("search_game_button.modePluralGenitive"), t("search_game_button.modePlural"))}`
        : searchedModes
            .map((mode) => {
              t(`matchmaking_mode.${mode}`);
            })
            .join(", ");
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
        <div>{t("search_game_button.cancelSearch")}</div>

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
        {content || t("search_game_button.play")}
      </Button>
    );
  }

  return null;
});
