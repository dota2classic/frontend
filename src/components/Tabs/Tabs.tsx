import React from "react";

import c from "./Tabs.module.scss";
import cx from "classnames";

interface ITabsProps {
  options: string[];
  onSelect: (v: string) => void;
  selected: string;
  className?: string;
}

export const Tabs: React.FC<ITabsProps> = ({
  options,
  onSelect,
  selected,
  className,
}) => {
  return (
    <div className={cx(c.tabs, className)}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => onSelect(option)}
          className={cx(c.tab, option === selected ? c.tab__active : undefined)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};
