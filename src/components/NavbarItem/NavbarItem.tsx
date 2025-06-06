import React, { PropsWithChildren, ReactNode } from "react";

import c from "./NavbarItem.module.scss";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";
import cx from "clsx";
import { useRouter } from "next/router";
import { IconType } from "react-icons";

type Action = NextLinkProp | (() => void) | string;

interface DropdownOption {
  action: NextLinkProp | (() => void) | string;
  label: ReactNode;
  Icon?: IconType;
  newCategory?: boolean;
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
        {/*{options && <FaAngleDown />}*/}
        {children}
      </PageLink>
    );
  } else if (typeof action === "string") {
    renderedLink = (
      <a className={"link"} href={action}>
        {children}
        {/*{options && <FaAngleDown />}*/}
      </a>
    );
  } else {
    renderedLink = (
      <a onClick={action}>
        {children}
        {/*{options && <FaAngleDown />}*/}
      </a>
    );
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
      <>{renderedLink}</>
      {options && (
        <div className={c.options}>
          {options.map((op, index) => {
            const Icon = op.Icon;
            return (
              <>
                {op.newCategory && <div className={c.delimiter} />}
                {typeof op.action === "string" ? (
                  <a
                    key={index}
                    className={cx(c.option, "link")}
                    href={op.action}
                  >
                    {Icon && <Icon />}
                    {op.label}
                  </a>
                ) : "href" in op.action ? (
                  <PageLink
                    className={cx(c.option, "link")}
                    key={index}
                    link={op.action}
                  >
                    {Icon && <Icon />}
                    {op.label}
                  </PageLink>
                ) : (
                  <span
                    key={index}
                    className={cx(c.option, "link")}
                    onClick={op.action}
                  >
                    {Icon && <Icon />}
                    {op.label}
                  </span>
                )}
              </>
            );
          })}
        </div>
      )}
    </li>
  );
};
