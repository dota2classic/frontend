import React, { PropsWithChildren } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import cx from "classnames";
import { useRouter } from "next/router";

interface INavbarItemProps {
  link?: NextLinkProp;
  href?: string;
  admin?: boolean;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
  href,
  admin,
}) => {
  const r = useRouter();
  const isActive = link?.href === r.pathname;

  return href ? (
    <a
      href={href}
      className={cx(c.navbarItem, admin && c.admin, isActive && c.active)}
    >
      {children}
    </a>
  ) : (
    <PageLink
      className={cx(c.navbarItem, admin && c.admin, isActive && c.active)}
      link={link!}
    >
      {children}
    </PageLink>
  );
};
