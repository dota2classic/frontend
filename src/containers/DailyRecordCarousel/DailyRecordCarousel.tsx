import React, { useMemo } from "react";
import { getApi } from "@/api/hooks";
import { PlayerDailyRecord, UserDTO } from "@/api/back";
import { TranslationKey } from "@/TranslationKey";
import { UserPreview } from "@/components/UserPreview";
import c from "./DailyRecordCarousel.module.scss";
import { useTranslation } from "react-i18next";
import { AutoCarousel } from "@/components/AutoCarousel/AutoCarousel";

interface DailyRecordAgg {
  player: UserDTO;
  value: string | number;
  label: TranslationKey;
  positive: boolean;
}

const maxBy = (
  records: PlayerDailyRecord[],
  field: keyof Omit<PlayerDailyRecord, "player">,
  key: TranslationKey,
  reverse: boolean = false,
): DailyRecordAgg => {
  const sorted = records.sort((a, b) => b[field] - a[field])[
    reverse ? records.length - 1 : 0
  ];

  return {
    player: sorted.player,
    value:
      (field === "mmrChange" ? (sorted[field] > 0 ? "+" : "") : "") +
      sorted[field],
    label: key,
    positive:
      (field === "mmrChange" && sorted[field] > 0) ||
      field === "wins" ||
      field === "games",
  };
};

export const DailyRecordCarousel: React.FC = () => {
  const { data } = getApi().record.useRecordControllerDailyRecords();
  const { t } = useTranslation();

  const stats = useMemo(() => {
    if (!data || !data.length) return null;

    return [
      maxBy(data, "games", `daily_record_carousel.games`),
      maxBy(data, "wins", `daily_record_carousel.wins`),
      maxBy(data, "loss", `daily_record_carousel.loss`),
      maxBy(data, "mmrChange", `daily_record_carousel.mmr_gained`),
      // maxBy(data, "mmrChange", `daily_record_carousel.mmr_lost`, true),
    ];
  }, [data]);

  if (!stats) return null;

  return (
    <>
      <header>{t("queue_page.fun.player_stats")}</header>
      <AutoCarousel
        className={c.carousel}
        orientation="vertical"
        interval={10000}
      >
        {stats.map((stat) => (
          <div className={c.card} key={stat.label}>
            <UserPreview user={stat.player} roles />
            <div>
              <span className={c.stat}>{t(stat.label)}: </span>
              <span className={stat.positive ? "green" : "red"}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </AutoCarousel>
    </>
  );
};
