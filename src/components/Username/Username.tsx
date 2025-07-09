import React, { useMemo } from "react";
import { PageLink } from "../PageLink/PageLink";
import { AppRouter, NextLinkProp } from "@/route";
import cx from "clsx";
import c from "./Username.module.scss";
import { UserDTO } from "@/api/back";
import { observer } from "mobx-react-lite";
import { UsernameRoles } from "@/components/Username/UsernameRoles";

interface UsernameProps {
  user: UserDTO;
  className?: string;
  nolink?: boolean;
  link?: NextLinkProp;
  testId?: string;
  roles?: boolean;
}

export const Username: React.FC<UsernameProps> = observer(function Username({
  user,
  className,
  nolink,
  link,
  testId,
  roles,
}) {
  const targetLink = link ?? AppRouter.players.player.index(user.steamId).link;

  const displayName = useMemo(() => {
    if (Number(user.steamId) < 10) {
      return `Бот #${user.steamId}`;
    }

    const trimmedNickname = user.name?.trim();
    const isEmptyNickname = !trimmedNickname || trimmedNickname === " ุ";

    if (isEmptyNickname) {
      return "<blank>";
    }
    return trimmedNickname;
  }, [user]);

  if (nolink) {
    return (
      <>
        <span className={cx(c.usernameLink, className)}>{displayName}</span>
        {roles && <UsernameRoles user={user} />}
      </>
    );
  }

  return (
    <>
      <PageLink
        link={targetLink}
        testId={testId}
        className={cx(c.usernameLinkContainer, "link", className)}
      >
        <span className={cx(c.usernameLink)}>{displayName}</span>
      </PageLink>
      {roles && <UsernameRoles user={user} />}
    </>
  );
});
