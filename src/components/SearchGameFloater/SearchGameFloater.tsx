import React from "react";

import { AcceptGameModal, SearchGameButton } from "..";

import c from "./SearchGameFloater.module.scss";
import { useRouter } from "next/router";

export const SearchGameFloater: React.FC = () => {
  const router = useRouter();

  const isQueuePage = router.pathname === "/queue";

  return (
    <div className={c.container}>
      <AcceptGameModal />
      <SearchGameButton visible={!isQueuePage} />
    </div>
  );
};
