import React from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";
import cx from "classnames";

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
          console.log("Enter queue called, wh norerernder");
        }}
        className={cx(
          c.button,
          c.search,
          auth.me?.banStatus.isBanned && c.banned,
          queue.gameInfo?.serverURL && c.ingame,
        )}
      >
        Искать игру
      </button>
    );
  }
  return (
    <button className={cx(c.button, queue.gameInfo?.serverURL && c.ingame)}>
      Отменить поиск
    </button>
  );
  //
  // (queue.searchingMode !== undefined && (
  //   <EmbedCancelSearch>
  //     <SearchGameButtonComp
  //       className={cx("cancel", queue.gameInfo?.serverURL && "ingame")}
  //       onClick={() => queue.cancelSearch()}
  //     >
  //       {i18n.cancelSearch}
  //     </SearchGameButtonComp>
  //     {!isQueuePage && (
  //       <GameSearchInfo>
  //         {formatGameMode(queue.searchingMode.mode)},{" "}
  //         {i18n.withValues.search({ s: queue.inQueueCount(queue.searchingMode.mode, queue.searchingMode.version) })}
  //       </GameSearchInfo>
  //     )}
  //   </EmbedCancelSearch>
  // )) || (
  //   <GameSearchInfo>
  //     <SearchGameButtonComp
  //       disabled={queue.selectedModeBanned}
  //       className={cx("search", auth.me?.banStatus.isBanned && "banned", queue.gameInfo?.serverURL && "ingame")}
  //       onClick={() => {
  //         if (!isQueuePage) {
  //           router.push("/queue", "/queue").finally();
  //           return;
  //         }
  //
  //         queue.enterQueue();
  //       }}
  //     >
  //       {i18n.searchGame}
  //     </SearchGameButtonComp>
  //   </GameSearchInfo>
  // )
});
