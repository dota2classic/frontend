import React, { useMemo } from "react";

import { NumberFormat, PageLink } from "..";

import c from "./RecordCard.module.scss";
import Image from "next/image";
import { formatDate } from "@/util/dates";
import { MatchDto, PlayerRecordDto } from "@/api/back";
import { AppRouter } from "@/route";
import { formatGameMode, formatRecordType } from "@/util/gamemode";
import { getRecordValue } from "@/util";

interface IRecordCardProps {
  record: PlayerRecordDto & { match: MatchDto };
  noPlayer?: boolean;
}

export const RecordCard: React.FC<IRecordCardProps> = ({
  record,
  noPlayer,
}) => {
  const pim = useMemo(
    () =>
      record.match.radiant
        .concat(record.match.dire)
        .find((t) => t.user.steamId === record.player.steamId)!,
    [record],
  );
  const image = useMemo(
    () =>
      `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${pim.hero.replace("npc_dota_hero_", "")}.png`,
    [pim.hero],
  );
  const recordValue = useMemo(
    () => getRecordValue(pim, record.recordType),
    [pim, record.recordType],
  );

  const isWin = useMemo(() => pim.team === record.match.winner, [pim, record]);

  return (
    <PageLink
      link={AppRouter.matches.match(record.match.id).link}
      className={c.card}
    >
      <Image
        className={c.image}
        alt={""}
        src={image}
        width={500}
        height={500}
      />
      <div className={c.shadow} />
      <div className={c.contentContainer}>
        <span className={c.recordType}>
          {formatRecordType(record.recordType)}
        </span>
        <div className={c.recordValue}>
          <NumberFormat comma number={recordValue} />
        </div>
        {!noPlayer && (
          <h3>
            <span className={c.player}>{record.player.name}</span>
          </h3>
        )}
        <time className={c.recordTime}>
          <span className={isWin ? "green" : "red"}>
            {isWin ? "победа" : "поражение"}
          </span>{" "}
          {formatDate(new Date(record.match.timestamp))},{" "}
          {formatGameMode(record.match.mode)}
        </time>
      </div>
    </PageLink>
  );
};
