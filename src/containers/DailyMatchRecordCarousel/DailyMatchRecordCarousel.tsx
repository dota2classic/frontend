import React from "react";
import { AutoCarousel } from "@/components/AutoCarousel/AutoCarousel";
import { getApi } from "@/api/hooks";
import { RecordCard, RecordCardPlaceholder } from "@/components/RecordCard";
import { useTranslation } from "react-i18next";
import c from "./DailyMatchRecordCarousel.module.scss";

export const DailyMatchRecordCarousel: React.FC = ({}) => {
  const { data } = getApi().record.useRecordControllerRecords();
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <>
      <header>{t("queue_page.fun.day_records")}</header>
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
    </>
  );
};
