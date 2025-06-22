import React from "react";
import { PageLink } from "../PageLink/PageLink";
import { AppRouter, NextLinkProp } from "@/route";
import cx from "clsx";
import c from "./Username.module.scss";
import { UserDTO } from "@/api/back";

interface UsernameProps {
  user: UserDTO;
  className?: string;
  nolink?: boolean;
  link?: NextLinkProp;
  testId?: string;
}

export const Username: React.FC<UsernameProps> = ({
  user,
  className,
  nolink,
  link,
  testId,
}) => {
  const targetLink = link ?? AppRouter.players.player.index(user.steamId).link;
  const displayName =
    Number(user.steamId) > 10
      ? user.name?.trim() || '<blank>'
      : `Бот #${user.steamId}`;

  if (nolink) {
    return <span className={cx(c.username, className)}>{displayName}</span>;
  }

  return (
    <div className={c.linkContainer} title={user.name}>
        <PageLink link={targetLink} testId={testId}>
            <span className={cx(c.usernameWrapper, "link")}>
                <span className={cx(c.usernameLink, className)}>
                    {displayName}
                </span>
            </span>
        </PageLink>
    </div>
  );
};
