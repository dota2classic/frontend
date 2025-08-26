/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import Select, { ActionMeta, SingleValue } from "react-select";
import { JetBrains_Mono } from "next/font/google";
import cx from "clsx";
import { useTranslation } from "react-i18next";

const tableFont = JetBrains_Mono({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface ISelectOptionsProps {
  options: SingleValue<any>[];
  selected: any;
  defaultValue?: any;
  onSelect: (v: SingleValue<any>, meta: ActionMeta<any>) => void;
  defaultText: ReactNode;
  className?: string;
}

export function SelectOptions({
  options,
  onSelect,
  selected,
  defaultText,
  defaultValue,
  className,
}: ISelectOptionsProps) {
  const { t } = useTranslation();

  return (
    <Select
      className={cx(tableFont.className, className)}
      classNames={{
        control: () => c.select,
        option: () => c.option,
        menu: () => c.menu,
        menuList: () => c.menuList,
        singleValue: () => c.preview,
      }}
      menuPosition="fixed"
      defaultValue={defaultValue}
      placeholder={defaultText || t("select_options.defaultText")}
      value={options.find((t) => t.value === selected)}
      onChange={onSelect}
      options={options}
    />
  );
}
