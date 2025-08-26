import React, { ReactNode } from "react";

import c from "./BigTabs.module.scss";
import cx from "clsx";
import { NextLinkProp } from "@/route";
import { PageLink } from "@/components";

export interface TabItem<T extends string, L = ReactNode> {
  key: T;
  label: L;
  onSelect: SelectAction<T>;
}

type SelectAction<T> = NextLinkProp | ((item: T) => void);

function isNextLinkProp<T>(u: SelectAction<T>): u is NextLinkProp {
  return "href" in u;
}

export interface IBigTabsProps<T extends string = string, L = ReactNode> {
  items: TabItem<T, L>[];
  selected: T;
  className?: string;
  flavor: "small" | "big";
}

export function BigTabs<T extends string>({
  items,
  selected,
  className,
  flavor,
}: IBigTabsProps<T>) {
  const children = items.map((item) => {
    const onSelect = item.onSelect;
    if (isNextLinkProp(onSelect)) {
      return (
        <PageLink
          key={item.key}
          className={cx(c.option, selected === item.key && c.active)}
          link={onSelect}
        >
          {item.label}
        </PageLink>
      );
    } else {
      const onClick = () => onSelect(item.key);
      return (
        <div
          key={item.key}
          className={cx(c.option, selected === item.key && c.active)}
          onClick={onClick}
        >
          {item.label}
        </div>
      );
    }
  });

  return (
    <div
      className={cx(
        c.tabs,
        flavor === "small" && c.tabs__small,
        flavor === "big" && c.tabs__big,
        className,
      )}
    >
      {children}
    </div>
  );
}
