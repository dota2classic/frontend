import React from "react";

import c from "./ParticipantPreview.module.scss";
import { BracketParticipantDto } from "@/api/back";
import { AppRouter } from "@/route";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import cx from "clsx";
import { threadFont } from "@/const/fonts";

interface IParticipantPreviewProps {
  participant: BracketParticipantDto;
}

export const ParticipantPreview: React.FC<IParticipantPreviewProps> = ({
  participant,
}) => {
  if (!participant.players) return null;

  return (
    <div className={cx(c.preview, threadFont.className)}>
      <div className={c.avatars}>
        {participant.players?.map((plr) => (
          <PlayerAvatar
            key={plr.steamId}
            width={45}
            height={45}
            user={plr}
            alt=""
            link={AppRouter.players.player.index(plr.steamId).link}
          />
        ))}
      </div>

      <span className={c.name}>{participant.name}</span>
    </div>
  );
};
