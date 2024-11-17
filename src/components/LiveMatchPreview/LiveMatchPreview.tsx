import React from "react";
import { LiveMatchDto, PlayerInfo } from "@/api/back";
import c from "./LiveMatchPreview.module.scss";
import {
  HeroIcon,
  ItemIcon,
  MatchSummaryScore,
  PageLink,
  Panel,
} from "@/components";
import { AppRouter } from "@/route";
import { KDATableData } from "@/components/GenericTable/GenericTable";
import { items } from "@/util/iter";
import cx from "classnames";
import { shortName } from "@/util/heroName";
import { formatGameMode } from "@/util/gamemode";
import { watchUrl } from "@/util/urls";
import { TbGrave2 } from "react-icons/tb";
import { remap } from "@/util/math";

interface ILiveMatchPreviewProps {
  match: LiveMatchDto;
}

const TeamListTable = ({ players }: { players: PlayerInfo[] }) => {
  return (
    <div className={c.teamTable}>
      {players.map((it) => (
        <div key={it.steamId} className={c.playerRow}>
          <div className={cx(c.playerHeroRow, it.respawnTime > 0 && c.dead)}>
            <HeroIcon small hero={it.hero} />
            <TbGrave2
              style={{ opacity: it.respawnTime > 0 ? 1 : 0 }}
              className={c.skull}
            />
            <span className={c.level}>{it.level}</span>
            {it.bot ? (
              <span>{"Бот"}</span>
            ) : (
              <PageLink link={AppRouter.players.player.index(it.steamId).link}>
                <span>{it.name}</span>
              </PageLink>
            )}
            <KDATableData
              kills={it.kills}
              deaths={it.deaths}
              assists={it.assists}
              forceInteger
            />
          </div>
          <div className={c.itemRow}>
            {items(it).map((it, index) => (
              <ItemIcon key={index} item={it} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MinimapHeroProps {
  hero: PlayerInfo;
}

const MinimapHero = ({ hero }: MinimapHeroProps) => {
  const { posX, posY, team, respawnTime } = hero;
  const dead = respawnTime > 0;

  // const remappedX = 5 + posX * 90;
  const remappedX = remap(posX, 0, 1, 0.02, 0.96) * 100;
  const remappedY = remap(posY, 0, 1, 0.02, 0.96) * 100;

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
  const radiant = match.heroes.filter((it) => it.team === 2);
  const dire = match.heroes.filter((it) => it.team === 3);
  return (
    <>
      <Panel className={c.panelContainer}>
        <div className={c.panel}>
          <div>Режим: {formatGameMode(match.matchmakingMode)}</div>
          <MatchSummaryScore
            duration={match.duration}
            direKills={dire.reduce((a, b) => a + b.kills, 0)}
            radiantKills={radiant.reduce((a, b) => a + b.kills, 0)}
          />
        </div>
      </Panel>

      <div className={c.liveMatch}>
        <TeamListTable players={radiant} />
        <div className={c.map}>
          {match.heroes.map((hero) => (
            <MinimapHero key={hero.steamId} hero={hero} />
          ))}
        </div>
        <TeamListTable players={dire} />
      </div>
      <div className={c.watchLive}>
        <a target={"__blank"} className="link" href={watchUrl(match.server)}>
          Смотреть в игре
        </a>
      </div>
    </>
  );
};

export const SmallLiveMatch: React.FC<ILiveMatchPreviewProps> = ({ match }) => {
  return (
    <div className={cx(c.map, c.map__small)}>
      {match.heroes.map((hero) => (
        <MinimapHero key={hero.steamId} hero={hero} />
      ))}
    </div>
  );
};
