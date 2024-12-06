import React from "react";

import c from "./PlayerSummary.module.scss";
import cx from "clsx";
import { formatWinrate } from "@/util/math";
import { PageLink, Panel, PlayerAvatar } from "@/components";
import { steamPage } from "@/util/resources";
import { AppRouter } from "@/route";
import { useIsAdmin } from "@/util/hooks";
import { observer } from "mobx-react-lite";
import { formatShortTime } from "@/util/dates";

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
      <Panel
        className={cx(className, c.summary)}
        data-testid="player-summary-panel"
      >
        <div className={c.left}>
          <div className={c.player}>
            <PlayerAvatar
              width={65}
              height={65}
              src={image}
              alt={`Avatar of player ${name}`}
            />
            <PageLink
              className={cx(c.playerName, "link")}
              link={AppRouter.players.player.index(steamId).link}
              testId={"player-summary-player-name"}
            >
              {steamId.length > 2 ? name : `Бот #${steamId}`}
            </PageLink>
          </div>
          <a
            target="__blank"
            className={cx(c.externalLink, "link")}
            href={`https://dotabuff.com/players/${steamId}`}
          >
            Dotabuff
          </a>
          <a
            target="__blank"
            className={cx(c.externalLink, "link")}
            href={steamPage(steamId)}
          >
            Steam
          </a>

          {isAdmin && (
            <PageLink
              className={c.externalLink}
              link={AppRouter.admin.player(steamId).link}
            >
              В админке
            </PageLink>
          )}
        </div>

        <div className={c.right}>
          {lastGameTimestamp && (
            <dl data-testid="player-summary-last-game">
              <dd>
                {formatShortTime(new Date(lastGameTimestamp))}
              </dd>
              <dt>последняя игра</dt>
            </dl>
          )}

          <dl data-testid="player-summary-win-loss">
            <dd>
              <span className="green">{wins}</span> -{" "}
              <span className="red">{loss}</span>
            </dd>
            <dt>Матчи</dt>
          </dl>
          <dl data-testid="player-summary-winrate">
            <dd className={wins > loss ? "green" : "red"}>
              {formatWinrate(wins, loss)}
            </dd>
            <dt>Доля побед</dt>
          </dl>
          <dl data-testid="player-summary-rating">
            <dd>{mmr ? <span>{mmr}</span> : "Нет"}</dd>
            <dt>Рейтинг</dt>
          </dl>
          <dl data-testid="player-summary-rank">
            <dd>{rank && rank > 0 ? <span>{rank}</span> : "Нет"}</dd>
            <dt>Ранг</dt>
          </dl>
        </div>
      </Panel>
    );
  },
);
