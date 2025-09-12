import React, { useMemo } from "react";

import c from "./QueueModeList.module.scss";
import { SelectMatchmakingMode } from "./SelectMatchmakingMode";
import { MatchmakingInfo } from "@/api/back";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { useTranslation } from "react-i18next";

interface IQueueModeListProps {
  modes: MatchmakingInfo[];
}

export const QueueModeList: React.FC<IQueueModeListProps> = ({ modes }) => {
  const { t } = useTranslation();
  const enabledModes = useMemo(
    () =>
      modes
        .filter((t) => t.enabled)
        .sort(
          (a, b) =>
            getLobbyTypePriority(a.lobbyType) -
            getLobbyTypePriority(b.lobbyType),
        ),
    [modes],
  );
  return (
    <QueuePageBlock title={t("queue_page.section.search")}>
      <div className={c.modes}>
        {enabledModes.map((mode) => (
          <SelectMatchmakingMode key={mode.lobbyType} mode={mode.lobbyType} />
        ))}
      </div>
    </QueuePageBlock>
  );
};
