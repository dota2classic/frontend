import React from "react";

import { PageLink, PlayerAvatar } from "..";

import c from "./PlayerPreviewRow.module.scss";
import cx from "clsx";
import { AppRouter } from "@/route";
import { UserDTO } from "@/api/back";

export const PlayerPreviewRow = ({ name, steamId, avatar }: UserDTO) => {
  return (
    <div className={c.playerPreview}>
      <PlayerAvatar
        width={45}
        height={45}
        src={avatar}
        alt={`Avatar of player ${name}`}
      />
      <PageLink
        className={cx("link")}
        link={AppRouter.players.player.index(steamId).link}
        testId={"player-summary-player-name"}
      >
        {steamId.length > 2 ? name : `Бот #${steamId}`}
      </PageLink>
    </div>
  );
};
