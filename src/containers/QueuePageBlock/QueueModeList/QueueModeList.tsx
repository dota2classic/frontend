import React, { useMemo } from "react";

import c from "./QueueModeList.module.scss";
import { SelectMatchmakingMode } from "./SelectMatchmakingMode";
import { MatchmakingInfo } from "@/api/back";
import { MatchmakingMode } from "@/api/mapped-models";
import { getLobbyTypePriority } from "@/util/getLobbyTypePriority";
import { SectionBlock } from "@/components/SectionBlock";
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
    <SectionBlock title={t("queue_page.section.search")}>
      <div className={c.modes}>
        {enabledModes.map((mode) => (
          <SelectMatchmakingMode key={mode.lobbyType} mode={mode.lobbyType} />
        ))}
        {/* Locked placeholder modes — not returned by the backend yet,
            rendered as always-disabled cards until we open them for real.
            The `as MatchmakingMode` casts go away once the API client is
            regenerated against the deployed backend (values 14/15 become
            real members of the generated union type). */}
        <SelectMatchmakingMode key={14} mode={14 as MatchmakingMode} />
        <SelectMatchmakingMode key={15} mode={15 as MatchmakingMode} />
      </div>
    </SectionBlock>
  );
};
