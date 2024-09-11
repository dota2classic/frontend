import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import { MatchmakingMode } from "@/const/enums";
import { formatGameMode } from "@/util/gamemode";
import heroes from "@/util/texts/heroes";

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
  onSelect: (v: any) => void;
  defaultText: ReactNode;
}

export function SelectOptions({
  options,
  onSelect,
  selected,
  defaultText,
}: ISelectOptionsProps) {
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
