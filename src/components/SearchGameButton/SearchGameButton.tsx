import React from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import cx from "classnames";
import { TimeAgo } from "@/components/TimeAgo/TimeAgo";

interface Props {
  visible: boolean;
}
export const SearchGameButton = observer((p: Props) => {
  const { queue, auth } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

  const isSearchModeDefined = queue.searchingMode !== undefined;

  let ban = queue.partyBanStatus;

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
        disabled={queue.selectedModeBanned}
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
          queue.selectedModeBanned && ban?.isBanned && c.banned,
          queue.gameInfo?.serverURL && c.ingame,
          queue.selectedModeBanned && ban?.isBanned && c.longText,
        )}
      >
        {queue.selectedModeBanned && ban?.isBanned ? (
          <>
            Поиск запрещен до <TimeAgo date={ban.bannedUntil} />
          </>
        ) : (
          "Искать игру"
        )}
      </button>
    );
  }

  return null;
});
