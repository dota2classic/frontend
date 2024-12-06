import React, { PropsWithChildren, ReactNode } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import cx from "clsx";
import { useRouter } from "next/router";

type Action = NextLinkProp | (() => void) | string;

interface DropdownOption {
  action: NextLinkProp | (() => void);
  label: ReactNode;
}
interface INavbarItemProps {
  action: Action;
  admin?: boolean;
  ignoreActive?: boolean;
  options?: DropdownOption[];
  className?: string;
  tip?: ReactNode;
  testId?: string;
}

function isPageLink(action: Action): action is NextLinkProp {
  return typeof action === "object" && "href" in action;
}

export const NavbarItem: React.FC<PropsWithChildren<INavbarItemProps>> = ({
  children,
  action,
  admin,
  ignoreActive,
  options,
  className,
  tip,
  testId,
}) => {
  const r = useRouter();
  let isActive: boolean = false;

  if (isPageLink(action)) {
    isActive = action.href === r.pathname && !ignoreActive;
  }

  let renderedLink: ReactNode;

  if (isPageLink(action)) {
    renderedLink = (
      <PageLink className={"link"} link={action}>
        {children}
      </PageLink>
    );
  } else if (typeof action === "string") {
    renderedLink = (
      <a className={"link"} href={action}>
        {children}
      </a>
    );
  } else {
    renderedLink = <a onClick={action}>{children}</a>;
  }

  return (
    <li
      className={cx(
        c.navbarItem,
        admin && c.admin,
        isActive && c.active,
        className,
      )}
      data-testid={testId}
    >
      {tip && <span className={c.tip}>{tip}</span>}
      {renderedLink}
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
