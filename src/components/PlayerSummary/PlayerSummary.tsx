import React from "react";

import c from "./PlayerSummary.module.scss";
import cx from "classnames";
import { formatWinrate } from "@/util/math";
import { PageLink, Panel, PlayerAvatar, TimeAgo } from "@/components";
import { steamPage } from "@/util/resources";
import { AppRouter } from "@/route";
import { useIsAdmin } from "@/util/hooks";
import { observer } from "mobx-react-lite";
import Image from "next/image";

interface IPlayerSummaryProps {
  className?: string;
  image: string;
  wins: number;
  loss: number;

  rank?: number;
  mmr?: number;

  name: string;
  steamId: string;
  lastGameTimestamp?: number | string;
}

export const PlayerSummary: React.FC<IPlayerSummaryProps> = observer(
  ({
    className,
    image,
    wins,
    loss,
    mmr,
    name,
    steamId,
    lastGameTimestamp,
    rank,
  }) => {
    const isAdmin = useIsAdmin();

    return (
      <Panel className={cx(className)}>
        <div className={c.left}>
          <PageLink
            className={c.player}
            link={AppRouter.players.player.index(steamId).link}
          >
            <PlayerAvatar
              width={65}
              height={65}
              src={image}
              alt={`Avatar of player ${name}`}
            />
            <div className={c.playerName}>
              {steamId.length > 2 ? name : `Бот #${steamId}`}
            </div>
          </PageLink>
          <a
            target="__blank"
            className={c.externalLink}
            href={`https://dotabuff.com/players/${steamId}`}
          >
            Dotabuff
          </a>
          <a
            target="__blank"
            className={c.externalLink}
            href={steamPage(steamId)}
          >
            Steam
          </a>

          {isAdmin && (
            <PageLink
              className={c.externalLink}
              link={AppRouter.admin.player(steamId).link}
            >
              | В админке
            </PageLink>
          )}
        </div>

        <div className={c.right}>
          {lastGameTimestamp && (
            <dl>
              <dd>
                <TimeAgo date={lastGameTimestamp} />
              </dd>
              <dt>последняя игра</dt>
            </dl>
          )}

          <dl>
            <dd>
              <span className="green">{wins}</span> -{" "}
              <span className="red">{loss}</span>
            </dd>
            <dt>Матчи</dt>
          </dl>
          <dl>
            <dd className={wins > loss ? "green" : "red"}>
              {formatWinrate(wins, loss)}
            </dd>
            <dt>Доля побед</dt>
          </dl>
          <dl>
            <dd>{mmr ? <span>{mmr}</span> : "Нет"}</dd>
            <dt>Рейтинг</dt>
          </dl>
          <dl>
            <dd>{rank ? <span>{rank}</span> : "Нет"}</dd>
            <dt>Ранг</dt>
          </dl>
        </div>
      </Panel>
    );
  },
);
