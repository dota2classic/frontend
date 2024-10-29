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
  ignoreActive?: boolean;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
  href,
  admin,
  ignoreActive,
}) => {
  const r = useRouter();
  const isActive = link?.href === r.pathname && !ignoreActive;

  return (
    <li className={cx(c.navbarItem, admin && c.admin, isActive && c.active)}>
      {href ? (
        <a className={"link"} href={href}>
          {children}
        </a>
      ) : (
        <PageLink className={"link"} link={link!}>
          {children}
        </PageLink>
      )}
    </li>
  );
};
