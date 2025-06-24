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
  block?: boolean;
}

export const Username: React.FC<UsernameProps> = ({
  user,
  className,
  nolink,
  link,
  testId,
  block,
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
    <div className={cx(c.usernameLinkContainer, block ? c.block : undefined)} title={user.name}>
        <PageLink link={targetLink} testId={testId}>
            <span className={cx(c.usernameWrapper, "link", "globalLinkReference")}>
                <span className={cx(c.usernameLink, className)}>
                    {displayName}
                </span>
            </span>
        </PageLink>
    </div>
  );
};
