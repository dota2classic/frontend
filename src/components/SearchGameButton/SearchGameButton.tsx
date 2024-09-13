import React from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import { FaSteam } from "react-icons/fa";
import { appApi } from "@/api/hooks";

export const SearchGameButton = observer(() => {
  const { queue } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

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

  return <button className={c.button}>a?</button>;
});
