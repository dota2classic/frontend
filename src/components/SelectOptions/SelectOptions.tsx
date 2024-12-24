/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

import c from "./SelectOptions.module.scss";
import { DotaGameMode, DotaMap, MatchmakingMode } from "@/api/mapped-models";
import { formatDotaMap, formatDotaMode, formatGameMode } from "@/util/gamemode";
import heroes from "@/util/texts/heroes";
import Select, { SingleValue } from "react-select";
import { JetBrains_Mono } from "next/font/google";
import { ActionMeta } from "react-select";

const tableFont = JetBrains_Mono({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const DotaMapOptions = [
  DotaMap.DOTA,
  DotaMap.DOTA681,
  DotaMap.DIRETIDE,
  DotaMap.DOTA_AUTUMN,
  DotaMap.DOTA_WINTER,
].map((dm) => ({
  label: formatDotaMap(dm),
  value: dm,
}));

export const DotaGameModeOptions = [
  DotaGameMode.ALLPICK,
  DotaGameMode.RANKED_AP,
  DotaGameMode.ALL_RANDOM,
  DotaGameMode.SINGLE_DRAFT,
  DotaGameMode.RANDOM_DRAFT,
  DotaGameMode.CAPTAINS_MODE,
  DotaGameMode.ABILITY_DRAFT,
  DotaGameMode.SOLOMID,
  DotaGameMode.GREEVILING,
  DotaGameMode.DIRETIDE,
].map((gm) => ({
  label: formatDotaMode(gm),
  value: gm,
}));
export const GameModeOptions = [
  { value: "undefined", label: "Все режимы" },
  ...[
    MatchmakingMode.RANKED,
    MatchmakingMode.UNRANKED,
    MatchmakingMode.SOLOMID,
    MatchmakingMode.BOTS,
  ].map((it) => ({
    value: it.toString(),
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
