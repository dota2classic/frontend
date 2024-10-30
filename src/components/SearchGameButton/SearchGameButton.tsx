import React from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import cx from "classnames";
import { TimeAgo } from "@/components/TimeAgo/TimeAgo";

export const SearchGameButton = observer(() => {
  const { queue, auth } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

  const isSearchModeDefined = queue.searchingMode !== undefined;

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

  if (!queue.ready) return <a className={c.button}>Идет соединение...</a>;

  if (isSearchModeDefined)
    return (
      <button
        onClick={() => {
          queue.cancelSearch();
        }}
        className={cx(c.button, queue.gameInfo?.serverURL && c.ingame)}
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
          c.button,
          c.search,
          auth.me?.banStatus.isBanned && c.banned,
          queue.gameInfo?.serverURL && c.ingame,
        )}
      >
        {auth.me?.banStatus?.isBanned ? (
          <>
            Поиск запрещен до <TimeAgo date={auth.me!.banStatus.bannedUntil} />
          </>
        ) : (
          "Искать игру"
        )}
      </button>
    );
  }

  return null;
});
