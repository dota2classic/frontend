import React, { PropsWithChildren } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";

interface INavbarItemProps {
  link: NextLinkProp;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
}) => {
  return (
    <li className={c.navbarItem}>
      <PageLink className={c.navbarItemLink} link={link}>{children}</PageLink>
    </li>
  );
};
