import React, { useMemo } from "react";

import { BigTabs } from "@/components/BigTabs";
import { PlayerRecordsResponse } from "@/api/back";
import { useQueryBackedParameter } from "@/util/useQueryBackedParameter";
import c from "./PlayerRecords.module.scss";
import { RecordCard, RecordCardPlaceholder } from "@/components/RecordCard";
import { useTranslation } from "react-i18next";

interface IPlayerRecordsProps {
  records: PlayerRecordsResponse;
  noPlayer?: boolean;
}

type Span = keyof PlayerRecordsResponse;

export const PlayerRecords: React.FC<IPlayerRecordsProps> = ({
  records,
  noPlayer,
}) => {
  const { t } = useTranslation();
  const [span, setSpan] = useQueryBackedParameter<Span>("span", true);
  const selectedSpan = useMemo<Span>(() => span || "season", [span]);

  const displayedRecords = useMemo(
    () => records[selectedSpan],
    [records, selectedSpan],
  );

  return (
    <>
      <BigTabs<Span>
        flavor="small"
        items={[
          {
            key: "season",
            label: t("player_records.thisSeason"),
            onSelect: setSpan,
          },
          {
            key: "month",
            label: t("player_records.thisMonth"),
            onSelect: setSpan,
          },
          {
            key: "overall",
            label: t("player_records.allTime"),
            onSelect: setSpan,
          },
        ]}
        selected={selectedSpan}
      />
      <div className={c.records}>
        {displayedRecords.map((record) =>
          record.match ? (
            <RecordCard
              key={record.recordType}
              record={record as unknown as never}
              noPlayer={noPlayer}
            />
          ) : (
            <RecordCardPlaceholder
              key={record.recordType}
              record={record}
              noPlayer={true}
            />
          ),
        )}
      </div>
    </>
  );
};
