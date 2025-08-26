import cx from "clsx";
import c from "@/components/TelegramInvite/TelegramInvite.module.scss";
import { FaDiscord } from "react-icons/fa";
import React from "react";
import { useTranslation } from "react-i18next";

export const DiscordInvite = ({
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
      href="https://discord.gg/36D4WdNquT"
      className={cx(c.telegram, "link", className)}
    >
      <FaDiscord /> {!noText && t("discord_invite.joinDiscord")}
    </a>
  );
};
