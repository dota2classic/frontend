import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import { MatchmakingMode } from "@/api/mapped-models";
import { formatGameMode } from "@/util/gamemode";
import heroes from "@/util/texts/heroes";
import Select from "react-select";
import { JetBrains_Mono } from "next/font/google";

const tableFont = JetBrains_Mono({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const GameModeOptions = [
  { value: "undefined", label: "Все режимы" },
  ...[
    MatchmakingMode.RANKED,
    MatchmakingMode.UNRANKED,
    MatchmakingMode.SOLOMID,
    MatchmakingMode.BOTS,
  ].map((it) => ({
    value: it,
    label: formatGameMode(it),
  })),
];

export const HeroOptions = [
  { value: "undefined", label: "Все герои" },
  ...heroes
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map((it) => ({
      value: it.tag,
      label: it.name,
    })),
];

interface ISelectOptionsProps {
  options: {
    value: any;
    label: ReactNode;
  }[];
  selected: any;
  onSelect: (v: { value: any; label: ReactNode }) => void;
  defaultText: ReactNode;
}

export function SelectOptions({
  options,
  onSelect,
  selected,
  defaultText,
}: ISelectOptionsProps) {
  return (
    <Select
      className={tableFont.className}
      classNames={{
        control: () => c.select,
        option: () => c.option,
        menu: () => c.menu,
      }}
      placeholder={defaultText}
      value={selected}
      onChange={onSelect}
      options={options}
      defaultMenuIsOpen={true}
    />
  );
}
