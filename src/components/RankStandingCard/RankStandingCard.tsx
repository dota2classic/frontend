import React from "react";

import c from "./RankStandingCard.module.scss";
import { BracketParticipantDto } from "@/api/back";
import { ParticipantPreview } from "@/components/ParticipantPreview";
import { FaTrophy } from "react-icons/fa";
import cx from "clsx";

interface IRankStandingCardProps {
  rank: number;
  participant: BracketParticipantDto;
}

export const RankStandingCard: React.FC<IRankStandingCardProps> = ({
  rank,
  participant,
}) => {
  return (
    <div className={c.card}>
      <div className={c.rank}>
        {rank <= 3 && (
          <FaTrophy
            className={cx(
              rank === 1 && "gold",
              rank === 2 && "silver",
              rank === 3 && "bronze",
            )}
          />
        )}
        {rank}
      </div>
      <div className={c.participant}>
        <ParticipantPreview participant={participant} />
      </div>
      <div className={c.prize}></div>
    </div>
  );
};
