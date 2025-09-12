import { useTranslation } from "react-i18next";
import cx from "clsx";
import Image from "next/image";
import c from "@/containers/NewQueuePage/NewQueuePage.module.scss";
import React from "react";
import { QueuePageBlock } from "@/containers/QueuePageBlock/QueuePageBlock";

export const QueueAdBlock = () => {
  const { t } = useTranslation();
  return (
    <QueuePageBlock title={t("queue_page.section.partners")}>
      <a href="https://collectorsshop.ru/promo/old" target="__blank">
        <Image
          className={cx(c.imgHorizontal)}
          src="/img/D2C_Collectors_Wide_01.webp"
          alt=""
          priority
          unoptimized
          width={1179}
          height={120}
        />
      </a>
    </QueuePageBlock>
  );
};
