import React, { useMemo } from "react";

import c from "./PlayerSummary.module.scss";
import cx from "clsx";
import { formatWinrate } from "@/util/math";
import {
  BigTabs,
  PageLink,
  Panel,
  PlayerAvatar,
  TimeAgo,
  Tooltipable,
} from "@/components";
import { AppRouter, NextLinkProp } from "@/route";
import { steamPage, useIsModerator } from "@/util";
import { observer } from "mobx-react-lite";
import { formatShortTime } from "@/util/dates";
import { FaSteam, FaTwitch } from "react-icons/fa";
import { MdLocalPolice } from "react-icons/md";
import { useRouter } from "next/router";
import { IBigTabsProps } from "@/components/BigTabs/BigTabs";
import {
  BanStatusDto,
  PlayerSessionDto,
  PlayerStatsDto,
  UserConnectionDtoConnectionEnum,
  UserDTO,
} from "@/api/back";
import { useStore } from "@/store";
import { formatBanReason } from "@/util/texts/bans";
import { hasSubscription } from "@/util/subscription";
import { formatGameMode } from "@/util/gamemode";
import { Username } from "../Username/Username";
import { useTranslation } from "react-i18next";

interface IPlayerSummaryProps {
  className?: string;

  stats: PlayerStatsDto;
  user: UserDTO;
  banStatus: BanStatusDto;
  session?: PlayerSessionDto;

  rank?: number;
  mmr?: number;

  lastGameTimestamp?: number | string;
}

type PlayerPage =
  | "overall"
  | "heroes"
  | "matches"
  | "teammates"
  | "records"
  | "drops"
  | "settings";

type Items = IBigTabsProps<PlayerPage, string>["items"];

const getMenuItems = (steamId: string, isMyProfile: boolean): Items => {
  const menuItems: Items = [
    {
      key: "overall",
      label: "player_summary.menu.overall",
      onSelect: AppRouter.players.player.index(steamId).link,
    },
    {
      key: "matches",
      label: "player_summary.menu.matches",
      onSelect: AppRouter.players.playerMatches(steamId).link,
    },
    {
      key: "teammates",
      label: "player_summary.menu.teammates",
      onSelect: AppRouter.players.player.teammates(steamId).link,
    },
    {
      key: "heroes",
      label: "player_summary.menu.heroes",
      onSelect: AppRouter.players.player.heroes(steamId).link,
    },
    {
      key: "records",
      label: "player_summary.menu.records",
      onSelect: AppRouter.players.player.records(steamId).link,
    },
  ];

  if (isMyProfile) {
    menuItems.push({
      key: "drops",
      label: "player_summary.menu.drops",
      onSelect: AppRouter.players.player.drops(steamId).link,
    });
    menuItems.push({
      key: "settings",
      label: "player_summary.menu.settings",
      onSelect: AppRouter.players.player.settings(steamId).link,
    });
  }

  return menuItems;
};

export const PlayerSummary: React.FC<IPlayerSummaryProps> = observer(
  ({
    className,
    lastGameTimestamp,
    session,
    banStatus,
    stats,
    user,
    rank,
    mmr,
  }) => {
    const { t } = useTranslation();
    const { wins, abandons, loss } = stats;
    const isModerator = useIsModerator();

    const isMyProfile = useStore().auth.parsedToken?.sub === user.steamId;
    const isOld = hasSubscription(user);

    const twitchConnection = user.connections.find(
      (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
    );

    const r = useRouter();

    const { steamId, name } = user;

    const items = useMemo<Items>(
      () => getMenuItems(steamId, isMyProfile),
      [isMyProfile, steamId],
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
                user={user}
                alt={t("player_summary.avatarAlt", { name })}
              />
              <div className={c.playerAndRoles}>
                <Username
                  user={user}
                  className={cx(c.playerName, "link")}
                  testId={"player-summary-player-name"}
                />
                <div className={cx(c.player, c.icons)}>
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
                  {isOld && (
                    <Tooltipable
                      tooltip={t("player_summary.subscriberTooltip")}
                    >
                      <img width={20} height={20} src="/logo/128.png" />
                    </Tooltipable>
                  )}
                  {isModerator && (
                    <PageLink
                      className={c.externalLink}
                      link={AppRouter.admin.player(steamId).link}
                    >
                      <MdLocalPolice className={c.icon_svg} />
                    </PageLink>
                  )}
                  {twitchConnection && (
                    <a
                      target="__blank"
                      className={cx(c.externalLink, "link", c.twitch)}
                      href={`https://twitch.tv/${twitchConnection.externalId}`}
                    >
                      <FaTwitch className={c.icon_svg} />
                      {twitchConnection.externalId}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={"right"}>
            {session && (
              <dl data-testid="player-summary-last-game">
                <dd>
                  <PageLink
                    link={AppRouter.matches.match(session.matchId).link}
                  >
                    {formatGameMode(session.lobbyType)}
                  </PageLink>
                </dd>
                <dt>{t("player_summary.matchPlaying")}</dt>
              </dl>
            )}
            {lastGameTimestamp && (
              <dl data-testid="player-summary-last-game">
                <dd>{formatShortTime(new Date(lastGameTimestamp))}</dd>
                <dt>{t("player_summary.lastGame")}</dt>
              </dl>
            )}
            {banStatus.isBanned && (
              <dl data-testid="player-summary-win-loss">
                <Tooltipable
                  tooltip={t("player_summary.banReason", {
                    reason: formatBanReason(banStatus.status),
                  })}
                >
                  <dd>
                    <TimeAgo date={banStatus.bannedUntil} />
                  </dd>
                </Tooltipable>
                <dt>{t("player_summary.ban")}</dt>
              </dl>
            )}
            <dl className={c.games} data-testid="player-summary-win-loss">
              <Tooltipable tooltip={t("player_summary.winLossTooltip")}>
                <dd>
                  <span className="green">{wins}</span>
                  <span className="red">{loss}</span>
                  <span className="grey">{abandons}</span>
                </dd>
              </Tooltipable>
              <dt>{t("player_summary.matches")}</dt>
            </dl>
            <dl data-testid="player-summary-winrate">
              <dd className={wins > loss ? "green" : "red"}>
                {formatWinrate(wins, loss)}
              </dd>
              <dt>{t("player_summary.winRate")}</dt>
            </dl>
            <dl data-testid="player-summary-rating">
              <dd>{mmr ? <span>{mmr}</span> : t("player_summary.noRating")}</dd>
              <dt>{t("player_summary.rating")}</dt>
            </dl>
            <dl data-testid="player-summary-rank">
              <dd>
                {rank && rank > 0 ? (
                  <span>{rank}</span>
                ) : (
                  t("player_summary.noRank")
                )}
              </dd>
              <dt>{t("player_summary.rank")}</dt>
            </dl>
          </div>
        </Panel>
        <BigTabs<PlayerPage>
          className={c.tabs}
          flavor="small"
          items={items.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
          selected={selected?.key || "overall"}
        />
      </>
    );
  },
);
