import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";

interface ISelectOptionsProps<T> {
  options: {
    value: any;
    label: ReactNode;
  }[];
  selected: any;
  onSelect: (v: T) => void;
  defaultText: ReactNode;
}

export function SelectOptions<T extends any>({
  options,
  onSelect,
  selected,
  defaultText,
}: ISelectOptionsProps<T>) {

  return (
    <div className={c.select}>
      <select value={selected} onChange={(v) => onSelect(v.target.value)}>
        {options.map((it) => (
          <option key={it.value} value={it.value}>
            {it.label}
          </option>
        ))}
      </select>
    </div>
  );
}
