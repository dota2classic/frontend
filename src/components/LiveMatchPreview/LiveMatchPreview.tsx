import React from "react";
import {
  DotaConnectionState,
  DotaGameRulesState,
  LiveMatchDto,
  MatchSlotInfo,
  PlayerInfo,
} from "@/api/back";
import c from "./LiveMatchPreview.module.scss";
import {
  CopySomething,
  EmbedProps,
  HeroIcon,
  Input,
  ItemIcon,
  PageLink,
  PlaceholderImage,
} from "@/components";
import { AppRouter } from "@/route";
import { KDATableData } from "@/components/GenericTable/GenericTable";
import cx from "clsx";
import heroName, { shortName } from "@/util/heroName";
import { watchCmd } from "@/util/urls";
import { TbGrave2 } from "react-icons/tb";
import { remapNumber } from "@/util/math";
import { iterateItems } from "@/util";
import { Username } from "../Username/Username";

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
              alt={`Player ${slot.user.name} abandoned`}
              src="/abandon.png"
            />
          </div>
          <Username user={slot.user} block />
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
          <PageLink link={ AppRouter.heroes.hero.index(hero.hero).link}>
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
            alt={`Player ${slot.user.name} abandoned`}
            src="/abandon.png"
          />
          </div>
          <Username user={slot.user} block />
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

interface MinimapHeroProps {
  hero: PlayerInfo;
  team: number;
}

const MinimapHero = ({ hero, team }: MinimapHeroProps) => {
  const { posX, posY, respawnTime } = hero;
  const dead = respawnTime > 0;

  // const remappedX = 5 + posX * 90;
  const remappedX = remapNumber(posX, 0, 1, 0.02, 0.96) * 100;
  const remappedY = remapNumber(posY, 0, 1, 0.02, 0.96) * 100;

  return (
    <div
      className={cx(c.hero, shortName(hero.hero), "d2mh", {
        [c.radiant]: team === 2,
        [c.dire]: team === 3,
        [c.dead]: dead,
      })}
      style={{
        left: `${remappedX}%`,
        bottom: `${remappedY}%`,
      }}
    >
      {/*<FaSkull*/}
      {/*  className={cx(c.deadIndicator, dead && c.deadIndicator__visible)}*/}
      {/*/>*/}
    </div>
  );
};

export const LiveMatchPreview: React.FC<ILiveMatchPreviewProps> = ({
  match,
}) => {
  const renderHeroPool =
    match.gameState >= DotaGameRulesState.PRE_GAME ? match.heroes : [];

  const radiant = match.heroes.filter((it) => it.team === 2);
  const dire = match.heroes.filter((it) => it.team === 3);
  return (
    <>
      <EmbedProps
        title={`LIVE матч ${match.matchId}`}
        description={`Превью активного матча ${match.matchId}, игровая карта с героями, которые двигаются по карте.`}
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
    </div>
  );
};
