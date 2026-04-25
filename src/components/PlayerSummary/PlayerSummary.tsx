import React, { useCallback, useEffect, useMemo, useState } from "react";

import c from "./PlayerSummary.module.scss";
import cx from "clsx";
import { formatWinrate } from "@/util/math";
import { AppRouter, NextLinkProp } from "@/route";
import { useIsModerator } from "@/util/useIsAdmin";
import { steamPage } from "@/util/steamId";
import { observer } from "mobx-react-lite";
import { useFormattedDateTime } from "@/util/dates";
import { FaSteam, FaTwitch } from "react-icons/fa";
import {
  MdBlock,
  MdLocalPolice,
  MdPersonAdd,
  MdPersonOff,
  MdPersonRemove,
} from "react-icons/md";
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
import { hasSubscription, paidAction } from "@/util/subscription";
import { Username } from "../Username/Username";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";
import { PlayerAvatar } from "../PlayerAvatar";
import { Tooltipable } from "../Tooltipable";
import { PageLink } from "../PageLink";
import { TimeAgo } from "../TimeAgo";
import { BigTabs } from "../BigTabs";
import { getApi } from "@/api/hooks";
import { ActionChip } from "../ActionChip";

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
  | "achievements"
  | "matches"
  | "teammates"
  | "records"
  | "drops"
  | "settings";

type Items = IBigTabsProps<PlayerPage, TranslationKey>["items"];

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
      key: "achievements",
      label: "player_summary.menu.achievements",
      onSelect: AppRouter.players.player.achievements(steamId).link,
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
    const formatShortTime = useFormattedDateTime();
    const { wins, abandons, loss } = stats;
    const isModerator = useIsModerator();

    const { auth, sub } = useStore();
    const { steamId, name } = user;
    const isMyProfile = auth.parsedToken?.sub === steamId;
    const isAuthorized = auth.isAuthorized;
    const isOld = hasSubscription(user);

    const { data: relation, mutate: mutateRelation } =
      getApi().playerApi.usePlayerControllerGetRelation(
        (isAuthorized && !isMyProfile ? steamId : null) as string,
      );

    const [isDodged, setIsDodged] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
      if (relation) {
        setIsDodged(relation.isDodged);
        setIsBlocked(relation.isBlocked);
        setIsFriend(relation.isFriend);
      }
    }, [relation]);

    const handleDodge = useCallback(
      paidAction(async () => {
        if (isDodged) {
          await getApi().playerApi.playerControllerUnDodgePlayer({
            dodgeSteamId: steamId,
          });
        } else {
          await getApi().playerApi.playerControllerDodgePlayer({
            dodgeSteamId: steamId,
          });
        }
        await mutateRelation();
      }),
      [isDodged, steamId, sub, mutateRelation],
    );

    const handleBlock = useCallback(
      paidAction(async () => {
        if (isBlocked) {
          await getApi().playerApi.playerControllerUnblockPlayer(steamId);
        } else {
          await getApi().playerApi.playerControllerBlockPlayer(steamId);
        }
        await mutateRelation();
      }),
      [isBlocked, steamId, sub, mutateRelation],
    );

    const handleFriend = useCallback(async () => {
      if (isFriend) {
        await getApi().playerApi.playerControllerRemoveFriend(steamId);
      } else {
        await getApi().playerApi.playerControllerAddFriend(steamId);
      }
      await mutateRelation();
    }, [isFriend, steamId, mutateRelation]);

    const twitchConnection = user.connections.find(
      (t) => t.connection === UserConnectionDtoConnectionEnum.TWITCH,
    );

    const r = useRouter();

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
      <div className={cx(c.summary, className)}>
        {/* ── BANNER ── */}
        <div className={c.banner}>
          <div className={c.bannerBody}>
            {/* identity + actions */}
            <div className={c.identityRow}>
              <div className={c.avatarWrap}>
                <PlayerAvatar
                  className={c.avatar}
                  width={80}
                  height={80}
                  user={user}
                  alt={t("player_summary.avatarAlt", { name })}
                />
              </div>

              <div className={c.identityMeta}>
                <div
                  className={cx(
                    c.eyebrow,
                    !session && !lastGameTimestamp && c.eyebrowHidden,
                  )}
                  aria-hidden={!session && !lastGameTimestamp}
                >
                  {session ? (
                    <>
                      <span className={c.eyebrowDot} />
                      {t(
                        `matchmaking_mode.${session.lobbyType}` as TranslationKey,
                      )}
                    </>
                  ) : lastGameTimestamp ? (
                    <>
                      {t("player_summary.lastGame")}:{" "}
                      {formatShortTime(new Date(lastGameTimestamp))}
                    </>
                  ) : (
                    "\u00a0"
                  )}
                </div>

                <Username
                  user={user}
                  className={cx(c.playerName, "link")}
                  testId="player-summary-player-name"
                />

                <div
                  className={cx(
                    c.banTag,
                    !banStatus.isBanned && c.banTagHidden,
                  )}
                  aria-hidden={!banStatus.isBanned}
                >
                  {banStatus.isBanned ? (
                    <>
                      {t("player_summary.ban")}:{" "}
                      <TimeAgo date={banStatus.bannedUntil} />
                      {" · "}
                      {t("player_summary.banReason", {
                        reason: formatBanReason(banStatus.status),
                      })}
                    </>
                  ) : (
                    "\u00a0"
                  )}
                </div>

                <div className={c.linksRow}>
                  <a
                    target="__blank"
                    className={c.linkIcon}
                    href={`https://dotabuff.com/players/${steamId}`}
                  >
                    <img
                      className={c.linkImg}
                      src="/dotabuff.png"
                      alt="Dotabuff"
                    />
                  </a>
                  <a
                    target="__blank"
                    className={c.linkIcon}
                    href={steamPage(steamId)}
                  >
                    <FaSteam />
                  </a>
                  {isOld && (
                    <Tooltipable
                      tooltip={t("player_summary.subscriberTooltip")}
                    >
                      <img width={18} height={18} src="/logo/128.png" alt="" />
                    </Tooltipable>
                  )}
                  {isModerator && (
                    <PageLink
                      className={c.linkIcon}
                      link={AppRouter.admin.player(steamId).link}
                    >
                      <MdLocalPolice />
                    </PageLink>
                  )}
                  {twitchConnection && (
                    <a
                      target="__blank"
                      className={cx(c.linkIcon, c.twitchLink)}
                      href={`https://twitch.tv/${twitchConnection.externalId}`}
                    >
                      <FaTwitch />
                      <span>{twitchConnection.externalId}</span>
                    </a>
                  )}
                </div>
              </div>

              {isAuthorized && !isMyProfile && (
                <div className={c.actions}>
                  <ActionChip
                    active={isFriend}
                    onClick={handleFriend}
                    variant={isFriend ? "success" : "neutral"}
                  >
                    {isFriend ? <MdPersonRemove /> : <MdPersonAdd />}
                    {t(
                      isFriend
                        ? "player_summary.unfriend"
                        : "player_summary.friend",
                    )}
                  </ActionChip>
                  <ActionChip
                    active={isDodged}
                    onClick={handleDodge}
                    variant="warning"
                  >
                    <MdPersonOff />
                    {t(
                      isDodged
                        ? "player_summary.undodge"
                        : "player_summary.dodge",
                    )}
                  </ActionChip>
                  <ActionChip
                    active={isBlocked}
                    onClick={handleBlock}
                    variant={isBlocked ? "danger" : "neutral"}
                  >
                    <MdBlock />
                    {t(
                      isBlocked
                        ? "player_summary.unblock"
                        : "player_summary.block",
                    )}
                  </ActionChip>
                </div>
              )}
            </div>

            {/* ── METRICS STRIP ── */}
            <div className={c.metricsStrip}>
              <div className={c.metricItem} data-testid="player-summary-rating">
                <div className={c.metricVal}>{mmr ?? "—"}</div>
                <div className={c.metricLbl}>{t("player_summary.rating")}</div>
              </div>
              <div className={c.metricItem} data-testid="player-summary-rank">
                <div className={c.metricVal}>
                  {rank && rank > 0 ? `#${rank}` : "—"}
                </div>
                <div className={c.metricLbl}>{t("player_summary.rank")}</div>
              </div>
              <div
                className={c.metricItem}
                data-testid="player-summary-winrate"
              >
                <div className={cx(c.metricVal, wins > loss ? "green" : "red")}>
                  {formatWinrate(wins, loss)}
                </div>
                <div className={c.metricLbl}>{t("player_summary.winRate")}</div>
              </div>
              <div
                className={c.metricItem}
                data-testid="player-summary-win-loss"
              >
                <div className={c.metricVal}>
                  <span className="green">{wins}</span>
                  <span className={c.metricSep}>/</span>
                  <span className="red">{loss}</span>
                  {abandons > 0 && (
                    <>
                      <span className={c.metricSep}>/</span>
                      <span className="grey">{abandons}</span>
                    </>
                  )}
                </div>
                <div className={c.metricLbl}>{t("player_summary.matches")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <BigTabs<PlayerPage>
          className={c.tabs}
          flavor="small"
          items={items.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
          selected={selected?.key || "overall"}
        />
      </div>
    );
  },
);
