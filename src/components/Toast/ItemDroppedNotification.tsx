import { MarketItemDtoFromJSON, NotificationDto } from "@/api/back";
import { AppRouter } from "@/route";
import c from "@/components/Toast/Toast.module.scss";
import { PageLink } from "@/components/PageLink";
import React, { useMemo } from "react";
import cx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  notification: NotificationDto;
}
export const ItemDroppedNotification: React.FC<Props> = ({ notification }) => {
  const item = useMemo(
    () => MarketItemDtoFromJSON(JSON.parse(notification.entityId)),
    [notification],
  );
  const { t } = useTranslation();

  return (
    <div className={c.vertical}>
      <PageLink
        link={AppRouter.players.player.drops(notification.steamId).link}
        className={cx("link", "rarity", item.rarity)}
      >
        {item.marketHashName}
      </PageLink>
      <img src={item.image} alt="" />
      <span>{t("notifications.itemDroppedDescription")}</span>
    </div>
  );
};
