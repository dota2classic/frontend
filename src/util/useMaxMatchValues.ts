import { PlayerInMatchDto } from "@/api/back";

export const getMaxMatchValues = (
  players: PlayerInMatchDto[],
  duration: number,
) => {
  const mx: Record<string, number> = {
    gpm: 0,
    xpm: 0,
    lastHits: 0,
    denies: 0,
    kills: 0,
    deaths: Infinity,
    assists: 0,
    heroDamage: 0,
    heroHealing: 0,
    towerDamage: 0,
    gold: 0,
  };
  for (const p of players) {
    mx.gpm = Math.max(mx.gpm, p.gpm);
    mx.xpm = Math.max(mx.xpm, p.xpm);
    mx.lastHits = Math.max(mx.lastHits, p.lastHits);
    mx.denies = Math.max(mx.denies, p.denies);
    mx.kills = Math.max(mx.kills, p.kills);
    mx.deaths = Math.min(mx.deaths, p.deaths);
    mx.assists = Math.max(mx.assists, p.assists);
    mx.heroDamage = Math.max(mx.heroDamage, p.heroDamage);
    mx.heroHealing = Math.max(mx.heroHealing, p.heroHealing);
    mx.towerDamage = Math.max(mx.towerDamage, p.towerDamage);
    const goldValue = Math.round(
      p.gold || Math.round((p.gpm * duration) / 60) * 0.6,
    );
    mx.gold = Math.max(mx.gold, goldValue);
  }
  return mx;
};
