/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import Select, { ActionMeta, SingleValue } from "react-select";
import { JetBrains_Mono } from "next/font/google";

const tableFont = JetBrains_Mono({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

interface ISelectOptionsProps {
  options: SingleValue<any>[];
  selected: any;
  defaultValue?: any;
  onSelect: (v: SingleValue<any>, meta: ActionMeta<any>) => void;
  defaultText: ReactNode;
}

export function SelectOptions({
  options,
  onSelect,
  selected,
  defaultText,
  defaultValue,
}: ISelectOptionsProps) {
  return (
    <Select
      className={tableFont.className}
      classNames={{
        control: () => c.select,
        option: () => c.option,
        menu: () => c.menu,
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
