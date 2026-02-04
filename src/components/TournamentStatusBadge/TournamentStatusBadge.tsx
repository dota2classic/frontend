import React from "react";
import { TranslationKey } from "@/TranslationKey";
import { Badge } from "@/components/Badge";
import { useTranslation } from "react-i18next";
import { TournamentStatus } from "@/api/back";
import { BadgeVariant } from "@/components/Badge/Badge";

const StatusMapping: Record<TournamentStatus, BadgeVariant> = {
  [TournamentStatus.DRAFT]: "grey",
  [TournamentStatus.REGISTRATION]: "blue",
  [TournamentStatus.READYCHECK]: "yellow",
  [TournamentStatus.INPROGRESS]: "blue",
  [TournamentStatus.FINISHED]: "green",
};

interface ITournamentStatusBadgeProps {
  status: TournamentStatus;
}

export const TournamentStatusBadge: React.FC<ITournamentStatusBadgeProps> = ({
  status,
}) => {
  const { t } = useTranslation();
  return (
    <Badge variant={StatusMapping[status]}>
      {t(`tournament.status.${status}` as TranslationKey)}
    </Badge>
  );
};
