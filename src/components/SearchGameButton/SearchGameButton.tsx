import React, { ReactNode } from "react";

import c from "./SearchGameButton.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { useRouter } from "next/router";
import cx from "clsx";
import { formatBanReason } from "@/util/texts/bans";
import { pluralize } from "@/util/pluralize";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PeriodicDurationTimerClient } from "../PeriodicTimer";
import { QueueButton } from "@/components/QueueButton/QueueButton";
import { makeSimpleToast } from "@/components/Toast";

interface Props {
  visible: boolean;
  customContent?: ReactNode;
}
export const SearchGameButton = observer((p: Props) => {
  const { t } = useTranslation();
  const { queue } = useStore();
  const router = useRouter();

  const isQueuePage = router.pathname.startsWith("/queue");
  const isLobbyPage = router.pathname.startsWith("/lobby/");

  const isInQueue = queue.queueState?.inQueue;

  const isPartyInLobby = queue.isPartyInLobby;
  const myLobby = queue.myLobbyId;

  let content: ReactNode;

  return null;
  
});
