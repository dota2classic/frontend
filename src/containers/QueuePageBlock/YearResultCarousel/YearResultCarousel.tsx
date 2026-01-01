import React from "react";
import { AutoCarousel } from "@/components/AutoCarousel/AutoCarousel";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";
import { YearResultCard } from "@/containers/QueuePageBlock/YearResultCarousel/YearResultCard";
import { TranslationKey } from "@/TranslationKey";
import { asItemName } from "@/components/ItemIcon/ItemIcon.props";

export const YearResultCarousel: React.FC = () => {
  const { data } = getApi().record.useRecordControllerPlayerYearSummary();
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <QueuePageBlock heading={t("queue_page.section.year_result")}>
      <AutoCarousel interval={3000}>
        <YearResultCard
          image={`/items/${asItemName(data.mostPurchasedItem)}_lg.webp`}
          title={"Любимый предмет"}
          recordValue={data.mostPurchasedItemCount}
          comment={"В стольких матчах ты купил этот предмет"}
        />
        <YearResultCard
          image="https://oyster.ignimgs.com/mediawiki/apis.ign.com/dota-2/a/ae/Good_Lane_Ranged.png"
          title={"Убито крипов"}
          recordValue={data.lastHits}
          comment={"Так им и надо"}
        />
        <YearResultCard
          image={"/Alchemist_Lore.webp"}
          title={"Заработано золота"}
          recordValue={data.gold}
          comment={"Прожиточный минимум"}
        />
        <YearResultCard
          image={"/sniper.webp"}
          title={"Промахов"}
          recordValue={data.misses}
          comment={"Может, стоит купить MKB?"}
        />
        <YearResultCard
          image="/maskot/branch.png"
          title={"Среднее КДА"}
          recordValue={data.kda}
          comment={"Могло быть и хуже"}
        />
        <YearResultCard
          image="/landing/download.webp"
          title={"Убито героев"}
          recordValue={data.kills}
          comment={"Каждый килл того стоил"}
        />
        <YearResultCard
          image="/landing/download.webp"
          title={"Помощи"}
          recordValue={data.assists}
          comment={"Сколько было помощи??"}
        />
        <YearResultCard
          image="/landing/download.webp"
          title={"Смертей"}
          recordValue={data.deaths}
          comment={"Всего лишь пауза на подумать"}
        />
        <YearResultCard
          image="/splash/boots.webp"
          title={"Сыграно игр"}
          recordValue={data.playedGames}
          comment={
            <div>
              Любимый режим
              <div>
                {t(`matchmaking_mode.${data.mostPlayedMode}` as TranslationKey)}
              </div>
            </div>
          }
        />
      </AutoCarousel>
    </QueuePageBlock>
  );
};
