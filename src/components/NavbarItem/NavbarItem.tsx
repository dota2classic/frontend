import React, { PropsWithChildren } from "react";

import c from "./NavbarItem.module.scss";
import Link from "next/link";
import { NextLinkProp } from "@/route";

interface INavbarItemProps {
  link: NextLinkProp;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
}) => {
  return (
    <li className={c.navbarItem}>
      <Link
        href={link.href}
        as={link.as}
        passHref={link.passHref}
        shallow={link.shallow}
      >
        {children}
      </Link>
    </li>
  );
};
