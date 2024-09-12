import React from "react";

import c from "./PlayerSummary.module.scss";
import cx from "classnames";
import { formatWinrate } from "@/util/math";
import { TimeAgo } from "@/components";
import { steamPage } from "@/util/resources";

interface IPlayerSummaryProps {
  className?: string;
  image: string;
  wins: number;
  loss: number;
  rank: number;
  rating: number;
  name: string;
  steamId: string;
  lastGameTimestamp?: number | string;
}

export const PlayerSummary: React.FC<IPlayerSummaryProps> = ({
  className,
  image,
  wins,
  loss,
  rating,
  name,
  steamId,
  lastGameTimestamp,
  rank,
}) => {
  const hasRank = rank >= 0;

  console.log(rank, hasRank);
  return (
    <div className={cx(c.panel, className)}>
      <div className={c.left}>
        <img src={image} alt="image in panel" />
        <div className={c.playerName}>{name}</div>
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
          <dd>{formatWinrate(wins, loss)}</dd>
          <dt>Доля побед</dt>
        </dl>
        <dl>
          <dd>{hasRank ? <span>{rating}</span> : "Нет"}</dd>
          <dt>Рейтинг</dt>
        </dl>
        <dl>
          <dd>{hasRank ? <span>{rank}</span> : "Нет"}</dd>
          <dt>Ранг</dt>
        </dl>
      </div>
    </div>
  );
};
