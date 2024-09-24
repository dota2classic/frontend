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

interface ILiveMatchPreviewProps {
  match: LiveMatchDto;
}

const TeamListTable = ({
  players,
  className,
}: {
  players: PlayerInfo[];
  className: string;
}) => {
  return (
    <div className={c.teamTable}>
      {players.map((it) => (
        <div className={c.playerRow}>
          <div className={c.playerHeroRow}>
            <HeroIcon small hero={it.hero} />
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
            {items(it).map((it) => (
              <ItemIcon item={it} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MinimapHeroProps {
  x: number;
  y: number;
  team: number;
  angle: number;
  hero: string;
  dead: boolean;
}

const MinimapHero = ({ x, y, hero, team, dead, angle }: MinimapHeroProps) => {
  return (
    <div
      className={cx(c.hero, shortName(hero), "d2mh", {
        [c.radiant]: team === 2,
        [c.dire]: team === 3,
        [c.dead]: dead,
      })}
      style={{
        left: `${x * 100}%`,
        bottom: `${y * 100}%`,
      }}
    >
      <span style={{ transform: `rotate(${-angle - 45}deg)` }} />
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
        <TeamListTable className={c.teamTable} players={radiant} />
        <div className={c.map}>
          {match.heroes.map((hero) => (
            <MinimapHero
              angle={hero.angle}
              dead={hero.respawnTime > 0}
              key={hero.hero}
              x={hero.posX}
              y={hero.posY}
              hero={hero.hero}
              team={hero.team}
            />
          ))}
        </div>
        <TeamListTable className={c.teamTable} players={dire} />
      </div>
      <div>
        <a target={"__blank"} href={watchUrl(match.server)}>
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
        <MinimapHero
          angle={hero.angle}
          dead={hero.respawnTime > 0}
          key={hero.hero}
          x={hero.posX}
          y={hero.posY}
          hero={hero.hero}
          team={hero.team}
        />
      ))}
    </div>
  );
};
