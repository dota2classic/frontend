import React, { useMemo } from "react";

import c from "./PlayerSummary.module.scss";
import cx from "clsx";
import { formatWinrate } from "@/util/math";
import {
  BigTabs,
  PageLink,
  Panel,
  PlayerAvatar,
  Tooltipable,
} from "@/components";
import { AppRouter, NextLinkProp } from "@/route";
import { steamPage, useIsModerator } from "@/util";
import { observer } from "mobx-react-lite";
import { formatShortTime } from "@/util/dates";
import { FaSteam } from "react-icons/fa";
import { MdLocalPolice } from "react-icons/md";
import { useRouter } from "next/router";
import { IBigTabsProps } from "@/components/BigTabs/BigTabs";
import { PlayerSummaryDto } from "@/api/back";

interface IPlayerSummaryProps {
  className?: string;
  image: string;

  summary: PlayerSummaryDto;

  name: string;
  steamId: string;
  lastGameTimestamp?: number | string;
}

type PlayerPage = "overall" | "heroes" | "matches" | "teammates" | "records";
type Items = IBigTabsProps<PlayerPage>["items"];

export const PlayerSummary: React.FC<IPlayerSummaryProps> = observer(
  ({ className, image, name, steamId, lastGameTimestamp, summary }) => {
    const { wins, abandons, loss, mmr, rank } = summary;
    const isModerator = useIsModerator();
    const r = useRouter();

    const items = useMemo<Items>(
      () => [
        {
          key: "overall",
          label: "Общее",
          onSelect: AppRouter.players.player.index(steamId).link,
        },
        {
          key: "matches",
          label: "Матчи",
          onSelect: AppRouter.players.playerMatches(steamId).link,
        },
        {
          key: "teammates",
          label: "Союзники",
          onSelect: AppRouter.players.player.teammates(steamId).link,
        },
        {
          key: "heroes",
          label: "Герои",
          onSelect: AppRouter.players.player.heroes(steamId).link,
        },
        {
          key: "records",
          label: "Рекорды",
          onSelect: AppRouter.players.player.records(steamId).link,
        },
      ],
      [steamId],
    );

    const selected = useMemo(
      () =>
        items.find(
          (t) => (t.onSelect as NextLinkProp).as === r.asPath.split("?")[0],
        ),
      [items, r],
    );

    return (
      <>
        <Panel
          className={cx(className, c.panel)}
          data-testid="player-summary-panel"
        >
          <div className={"left"}>
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
            <div className={c.player}>
              <a
                target="__blank"
                className={cx(c.externalLink, "link")}
                href={`https://dotabuff.com/players/${steamId}`}
              >
                <img className={c.icon} src="/dotabuff.png" alt="" />
              </a>
              <a
                target="__blank"
                className={cx(c.externalLink, "link")}
                href={steamPage(steamId)}
              >
                <FaSteam className={c.icon_svg} />
              </a>
              {isModerator && (
                <PageLink
                  className={c.externalLink}
                  link={AppRouter.admin.player(steamId).link}
                >
                  <MdLocalPolice className={c.icon_svg} />
                </PageLink>
              )}
            </div>
          </div>

          <div className={"right"}>
            {lastGameTimestamp && (
              <dl data-testid="player-summary-last-game">
                <dd>{formatShortTime(new Date(lastGameTimestamp))}</dd>
                <dt>последняя игра</dt>
              </dl>
            )}

            <dl className={c.games} data-testid="player-summary-win-loss">
              <Tooltipable tooltip={"Побед - Поражений - Покинутых игр"}>
                <dd>
                  <span className="green">{wins}</span>
                  <span className="red">{loss}</span>
                  <span className="grey">{abandons}</span>
                </dd>
              </Tooltipable>
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
        <BigTabs<PlayerPage>
          className={c.tabs}
          flavor="small"
          items={items}
          selected={selected?.key || "overall"}
        />
      </>
    );
  },
);
