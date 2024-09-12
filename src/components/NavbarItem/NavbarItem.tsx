import React, { PropsWithChildren } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";

interface INavbarItemProps {
  link?: NextLinkProp;
  href?: string;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
  href,
}) => {
  return href ? (
    <a href={href} className={c.navbarItem}>
      {children}
    </a>
  ) : (
    <PageLink className={c.navbarItem} link={link!}>
      {children}
    </PageLink>
  );
};
