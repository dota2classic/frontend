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
  return null;
  
});
