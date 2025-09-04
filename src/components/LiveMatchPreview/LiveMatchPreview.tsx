import React from "react";
import {
  DotaConnectionState,
  DotaGameRulesState,
  LiveMatchDto,
  MatchSlotInfo,
} from "@/api/back";
import c from "./LiveMatchPreview.module.scss";
import { AppRouter } from "@/route";
import { KDATableData } from "@/components/GenericTable/GenericTable";
import cx from "clsx";
import heroName from "@/util/heroName";
import { TbGrave2 } from "react-icons/tb";
import { iterateItems } from "@/util/iterateItems";
import { Username } from "../Username/Username";
import { useTranslation } from "react-i18next";
import { watchCmd } from "@/util/urls";
import { MinimapTowers } from "@/components/LiveMatchPreview/MinimapTower";
import { MinimapHero } from "@/components/LiveMatchPreview/MinimapHero";
import { ItemIcon, PlaceholderImage } from "../ItemIcon";
import { PageLink } from "../PageLink";
import { HeroIcon } from "../HeroIcon";
import { EmbedProps } from "../EmbedProps";
import { CopySomething } from "../CopySomething";
import { Input } from "../Input";

interface ILiveMatchPreviewProps {
  match: LiveMatchDto;
}

const allEmptyItems = {
  item0: 0,
  item1: 0,
  item2: 0,
  item3: 0,
  item4: 0,
  item5: 0,
};

const TeamListTableEntry = (slot: MatchSlotInfo) => {
  const hero = slot.heroData;
  const { t } = useTranslation();

  if (!hero) {
    return (
      <div key={slot.user.steamId} className={c.playerRow}>
        <div className={cx(c.playerHeroRow)}>
          <div className={cx(c.heroIconWrapper, c.mr)}>
            <PlaceholderImage width={53} height={30} />
            <img
              className={cx(
                c.abandon,
                slot.connection ===
                  DotaConnectionState.DOTA_CONNECTION_STATE_NOT_YET_CONNECTED &&
                  c.abandon__visible,
              )}
              alt={t("live_match.playerAbandoned", {
                playerName: slot.user.name,
              })}
              src="/abandon.png"
            />
          </div>
          <Username className={c.username} user={slot.user} />
          <KDATableData kills={0} deaths={0} assists={0} forceInteger />
        </div>
        <div className={c.itemRow}>
          {iterateItems(allEmptyItems).map((it, index) => (
            <ItemIcon key={index} item={it} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div key={slot.user.steamId} className={c.playerRow}>
      <div className={cx(c.playerHeroRow, hero.respawnTime > 0 && c.dead)}>
        <div className={c.iconPlusName}>
          <div className={c.heroIconWrapper} title={heroName(hero.hero)}>
            <PageLink link={AppRouter.heroes.hero.index(hero.hero).link}>
              <HeroIcon small hero={hero.hero} />
            </PageLink>
            <TbGrave2
              style={{ opacity: hero.respawnTime > 0 ? 1 : 0 }}
              className={c.skull}
            />
            <span className={c.level}>{hero.level}</span>
            <img
              className={cx(
                c.abandon,
                (slot.connection ===
                  DotaConnectionState.DOTA_CONNECTION_STATE_DISCONNECTED ||
                  slot.connection ===
                    DotaConnectionState.DOTA_CONNECTION_STATE_ABANDONED) &&
                  c.abandon__visible,
              )}
              alt={t("live_match.playerAbandoned", {
                playerName: slot.user.name,
              })}
              src="/abandon.png"
            />
          </div>
          <Username className={c.username} user={slot.user} />
        </div>
        <KDATableData
          kills={hero.kills}
          deaths={hero.deaths}
          assists={hero.assists}
          forceInteger
        />
      </div>
      <div className={c.itemRow}>
        {iterateItems(hero).map((it, index) => (
          <ItemIcon key={index} item={it} />
        ))}
      </div>
    </div>
  );
};

const TeamListTable = ({ players }: { players: MatchSlotInfo[] }) => {
  return (
    <div className={c.teamTable}>
      {players.map((it) => (
        <TeamListTableEntry key={it.user.steamId} {...it} />
      ))}
    </div>
  );
};

export const LiveMatchPreview: React.FC<ILiveMatchPreviewProps> = ({
  match,
}) => {
  const { t } = useTranslation();
  const renderHeroPool =
    match.gameState >= DotaGameRulesState.PRE_GAME ? match.heroes : [];

  const radiant = match.heroes.filter((it) => it.team === 2);
  const dire = match.heroes.filter((it) => it.team === 3);
  return (
    <>
      <EmbedProps
        title={t("live_match.liveMatch", { matchId: match.matchId })}
        description={t("live_match.matchPreview", { matchId: match.matchId })}
      />
      <div className={c.liveMatch}>
        <TeamListTable players={radiant} />
        <div className={c.map}>
          {renderHeroPool
            .filter((t) => t.heroData)
            .map((slot) => (
              <MinimapHero
                key={slot.user.steamId}
                hero={slot.heroData!}
                team={slot.team}
              />
            ))}
          <MinimapTowers towers={match.towers} barracks={match.barracks} />
        </div>
        <TeamListTable players={dire} />
      </div>
      <div className={c.watchLive}>
        <CopySomething
          something={watchCmd(match.server)}
          placeholder={<Input value={watchCmd(match.server)} readOnly={true} />}
        />
      </div>
    </>
  );
};

export const SmallLiveMatch: React.FC<ILiveMatchPreviewProps> = ({ match }) => {
  const heroPool =
    match.gameState >= DotaGameRulesState.PRE_GAME ? match.heroes : [];
  return (
    <div className={cx(c.map, c.map__small)}>
      {heroPool
        .filter((t) => t.heroData)
        .map((slot) => (
          <MinimapHero
            key={slot.user.steamId}
            hero={slot.heroData!}
            team={slot.team}
          />
        ))}
      <MinimapTowers towers={match.towers} barracks={match.barracks} />
    </div>
  );
};
