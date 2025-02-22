import c from "@/components/RecordCard/RecordCard.module.scss";
import Image from "next/image";
import { formatRecordType } from "@/util/gamemode";
import React from "react";
import { PlayerRecordDto } from "@/api/back";

interface IRecordCardProps {
  record: PlayerRecordDto;
  noPlayer?: boolean;
}

export const RecordCardPlaceholder = ({
  record,
  noPlayer,
}: IRecordCardProps) => (
  <span className={c.card}>
    <Image
      className={c.image}
      alt={""}
      src={"/landing/download.webp"}
      width={500}
      height={500}
    />
    <div className={c.shadow} />
    <div className={c.contentContainer}>
      <span className={c.recordType}>
        {formatRecordType(record.recordType)}
      </span>
      <div className={c.recordValue}>Не поставлен</div>
      {!noPlayer && (
        <h3>
          <span className={c.player}>{record.player.name}</span>
        </h3>
      )}
    </div>
  </span>
);
