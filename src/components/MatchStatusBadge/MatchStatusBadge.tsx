import React from "react";
import { MatchStatus } from "@/api/back";
import { Badge, BadgeVariant } from "@/components/Badge/Badge";
import { TranslationKey } from "@/TranslationKey";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Badge variant={StatusMapping[status]}>
      {t(`tournament.match_status.${status}` as TranslationKey)}
    </Badge>
  );
};
