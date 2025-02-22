import React, { useMemo } from "react";

import { BigTabs, RecordCard } from "@/components";
import { PlayerRecordsResponse } from "@/api/back";
import { useQueryBackedParameter } from "@/util";
import c from "./PlayerRecords.module.scss";
import { RecordCardPlaceholder } from "@/components/RecordCard/RecordCardPlaceholder";

interface IPlayerRecordsProps {
  records: PlayerRecordsResponse;
  noPlayer?: boolean;
}

type Span = keyof PlayerRecordsResponse;

export const PlayerRecords: React.FC<IPlayerRecordsProps> = ({
  records,
  noPlayer,
}) => {
  const [span, setSpan] = useQueryBackedParameter<Span>("span", true);
  const selectedSpan = useMemo<Span>(() => span || "month", [span]);

  const displayedRecords = useMemo(
    () => records[selectedSpan],
    [records, selectedSpan],
  );

  return (
    <>
      <BigTabs<Span>
        flavor="small"
        items={[
          // { key: "season", label: "В этом сезоне", onSelect: setSpan },
          { key: "month", label: "В этом месяце", onSelect: setSpan },
          { key: "overall", label: "За все время", onSelect: setSpan },
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
