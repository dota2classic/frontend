import React from "react";
import { MatchStatus } from "@/api/back";
import { BadgeVariant } from "@/components/Badge/Badge";
import { TranslationKey } from "@/TranslationKey";
import { StatusBadge } from "@/components/StatusBadge";

const StatusMapping: Record<MatchStatus, BadgeVariant> = {
  [MatchStatus.Locked]: "grey",
  [MatchStatus.Waiting]: "grey",
  [MatchStatus.Ready]: "blue",
  [MatchStatus.Running]: "green",
  [MatchStatus.Completed]: "green",
  [MatchStatus.Archived]: "green",
};

interface IMatchStatusBadgeProps {
  status: MatchStatus;
}

export const MatchStatusBadge: React.FC<IMatchStatusBadgeProps> = ({
  status,
}) => {
  return (
    <StatusBadge
      status={status}
      translationKey={(currentStatus) =>
        `tournament.match_status.${currentStatus}` as TranslationKey
      }
      variantMap={StatusMapping}
    />
  );
};
