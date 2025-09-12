import React from "react";
import { AutoCarousel } from "@/components/AutoCarousel/AutoCarousel";
import { getApi } from "@/api/hooks";
import { RecordCard, RecordCardPlaceholder } from "@/components/RecordCard";
import c from "./DailyMatchRecordCarousel.module.scss";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const DailyMatchRecordCarousel: React.FC = ({}) => {
  const { data } = getApi().record.useRecordControllerRecords();
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <QueuePageBlock title={t("queue_page.section.day_records")}>
      <AutoCarousel interval={15000}>
        {data.day.map((record) =>
          record.match ? (
            <div key={record.recordType} className={c.fixRecordBorder}>
              <RecordCard record={record as unknown as never} />
            </div>
          ) : (
            <RecordCardPlaceholder
              key={record.recordType}
              record={record}
              noPlayer={true}
            />
          ),
        )}
      </AutoCarousel>
    </QueuePageBlock>
  );
};
