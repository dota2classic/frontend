import React from "react";

import c from "./TelegramInvite.module.scss";
import { FaTelegram } from "react-icons/fa";
import cx from "clsx";

export const TelegramInvite = ({
  className,
  noText,
}: {
  className?: string;
  noText?: boolean;
}) => {
  return (
    <a
      target="__blank"
      href="https://t.me/dota2classicru"
      className={cx(c.telegram, "link", className)}
    >
      <FaTelegram /> {!noText && "Telegram"}
    </a>
  );
};
