import React, { ReactNode } from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import cx from "classnames";
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

  const isSearchModeDefined = queue.searchingMode !== undefined;

  let content: ReactNode;

  if (queue.selectedModeBanned && queue.partyBanStatus?.isBanned) {
    content = (
      <>
        Поиск запрещен:
        <div>{formatBanReason(queue.partyBanStatus!.status)}</div>
      </>
    );
  } else if (
    queue.selectedMode.mode === MatchmakingMode.UNRANKED &&
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
  }

  if (!p.visible) return null;

  if (queue.needAuth)
    return (
      <a
        className={c.button}
        href={`${appApi.apiParams.basePath}/v1/auth/steam`}
      >
        <FaSteam />
        Войти
      </a>
    );

  if (!queue.ready) return <a className={c.playButton}>Подключаемся...</a>;

  if (isSearchModeDefined)
    return (
      <button
        onClick={() => {
          queue.cancelSearch();
        }}
        className={cx(c.playButton, queue.gameInfo?.serverURL && c.ingame)}
      >
        Отменить поиск
      </button>
    );

  if (!isSearchModeDefined) {
    return (
      <button
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
          queue.gameInfo?.serverURL && c.ingame,
          content && c.longText,
        )}
      >
        {content || "Искать игру"}
      </button>
    );
  }

  return null;
});
