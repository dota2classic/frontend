import React from "react";
import { TranslationKey } from "@/TranslationKey";
import { TournamentStatus } from "@/api/back";
import { BadgeVariant } from "@/components/Badge/Badge";
import { StatusBadge } from "@/components/StatusBadge";

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
  return (
    <StatusBadge
      status={status}
      translationKey={(currentStatus) =>
        `tournament.status.${currentStatus}` as TranslationKey
      }
      variantMap={StatusMapping}
    />
  );
};
