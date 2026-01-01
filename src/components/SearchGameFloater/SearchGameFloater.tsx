import React from "react";

import { AcceptGameModal } from "../AcceptGameModal";

import c from "./SearchGameFloater.module.scss";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { QueueGameState, useQueueState } from "@/util/useQueueState";

export const SearchGameFloater: React.FC = observer(() => {
  const router = useRouter();

  const isQueuePage = router.pathname.startsWith("/queue");

  const qState = useQueueState();

  return (
    <div className={c.container}>
      <AcceptGameModal />
    </div>
  );
});
