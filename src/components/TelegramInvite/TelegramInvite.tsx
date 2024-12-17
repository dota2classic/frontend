import React from "react";

import c from "./TelegramInvite.module.scss";
import { FaTelegram } from "react-icons/fa";
import cx from "clsx";

export const TelegramInvite = ({ className }: { className?: string }) => {
  return (
    <a
      target="__blank"
      href="https://t.me/+GMQcIPRZnVAzY2Vi"
      className={cx(c.telegram, "link", className)}
    >
      <FaTelegram /> Telegram
    </a>
  );
};
