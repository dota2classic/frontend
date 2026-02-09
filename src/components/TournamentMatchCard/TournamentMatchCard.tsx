import React, { useState } from "react";

import c from "./TournamentMatchCard.module.scss";
import { useTranslation } from "react-i18next";
import { BracketMatchDto, ParticipantResultDto } from "@/api/back";
import { TranslationKey } from "@/TranslationKey";
import { TimeAgo } from "@/components/TimeAgo";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { MatchStatusBadge } from "@/components/MatchStatusBadge";
import { MatchInfoModal } from "@/components/MatchInfoModal";

interface ITournamentMatchCardProps {
  match: BracketMatchDto;
}

const RenderTeam = ({
  participant,
}: {
  participant?: ParticipantResultDto;
}) => {
  return (
    <div className={c.team}>
      <span className={c.score}>{participant?.score || 0}</span>
      <img src={participant?.participant?.avatar || "/avatar.png"} alt="" />
      <span>{participant?.participant?.name || "Еще не известен"}</span>
    </div>
  );
};

export const TournamentMatchCard: React.FC<ITournamentMatchCardProps> = ({
  match,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div
      className={cx(c.card, NotoSans.className)}
      onClick={() => setVisible(true)}
    >
      {visible && (
        <MatchInfoModal onClose={() => setVisible(false)} match={match} />
      )}
      <div className={c.left}>
        <MatchStatusBadge status={match.status} />
        <span>
          {t(`tournament.best_of.bo${match.childCount}` as TranslationKey)}
        </span>
        <span>
          {match.startDate ? (
            <TimeAgo pretty date={match.startDate} />
          ) : (
            <>Пока без времени</>
          )}
        </span>
      </div>
      <div className={c.middle}>
        <RenderTeam participant={match.opponent1} />
        <RenderTeam participant={match.opponent2} />
      </div>
    </div>
  );
};
