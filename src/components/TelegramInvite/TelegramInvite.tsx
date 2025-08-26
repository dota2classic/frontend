import React from "react";

import c from "./TelegramInvite.module.scss";
import { FaTelegram } from "react-icons/fa";
import cx from "clsx";
import { useTranslation } from "react-i18next";

export const TelegramInvite = ({
  className,
  noText,
}: {
  className?: string;
  noText?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <a
      target="__blank"
      href="https://t.me/dota2classicru"
      className={cx(c.telegram, "link", className)}
    >
      <FaTelegram /> {!noText && t("telegram_invite.telegram")}
    </a>
  );
};
