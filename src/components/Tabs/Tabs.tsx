import React from "react";

import c from "./Tabs.module.scss";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { TranslationKey } from "@/TranslationKey";

interface ITabsProps {
  options: TranslationKey[];
  onSelect: (v: TranslationKey) => void;
  selected: TranslationKey;
  className?: string;
}

export const Tabs: React.FC<ITabsProps> = ({
  options,
  onSelect,
  selected,
  className,
}) => {
  const { t } = useTranslation();
  return (
    <div className={cx(c.tabs, className)}>
      {options.map((option) => (
        <div
          key={option}
          onClick={() => onSelect(option)}
          className={cx(c.tab, option === selected ? c.tab__active : undefined)}
        >
          {t(option)}
        </div>
      ))}
    </div>
  );
};
