import React, { PropsWithChildren, ReactNode } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import cx from "classnames";
import { useRouter } from "next/router";

interface DropdownOption {
  action: NextLinkProp | (() => void);
  label: ReactNode;
}
interface INavbarItemProps {
  link?: NextLinkProp;
  href?: string;
  admin?: boolean;
  ignoreActive?: boolean;
  options?: DropdownOption[];
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  link,
  href,
  admin,
  ignoreActive,
  options,
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
      {options && (
        <div className={c.options}>
          {options.map((op, index) =>
            "href" in op.action ? (
              <PageLink
                className={cx(c.option, "link")}
                key={index}
                link={op.action}
              >
                {op.label}
              </PageLink>
            ) : (
              <span
                key={index}
                className={cx(c.option, "link")}
                onClick={op.action}
              >
                {op.label}
              </span>
            ),
          )}
        </div>
      )}
    </li>
  );
};
