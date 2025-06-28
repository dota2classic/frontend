/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import Select, { ActionMeta, SingleValue } from "react-select";
import { JetBrains_Mono } from "next/font/google";
import cx from "clsx";

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
      defaultValue={defaultValue}
      placeholder={defaultText}
      value={options.find((t) => t.value === selected)}
      onChange={onSelect}
      options={options}
    />
  );
}
