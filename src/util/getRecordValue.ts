import { PlayerInMatchDto, RecordType } from "@/api/back";

export function getRecordValue(
  pim: PlayerInMatchDto,
  record: RecordType,
): number {
  switch (record) {
    case RecordType.KILLS:
      return pim.kills;
    case RecordType.KDA:
      return (pim.kills + pim.assists) / Math.max(pim.deaths, 1);
    case RecordType.ASSISTS:
      return pim.assists;
    case RecordType.DEATHS:
      return pim.deaths;
    case RecordType.LASTHITS:
      return pim.lastHits;
    case RecordType.DENIES:
      return pim.denies;
    case RecordType.GPM:
      return pim.gpm;
    case RecordType.XPM:
      return pim.xpm;
    case RecordType.NETWORTH:
      return pim.gold;
    case RecordType.TOWERDAMAGE:
      return pim.towerDamage;
    case RecordType.HERODAMAGE:
      return pim.heroDamage;
    case RecordType.HEROHEALING:
      return pim.heroHealing;
  }
}
