/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import {Role} from "@/api/back";
import {useStore} from "@/store";



interface TooltipContext2 {
  hovered: HTMLElement;
  item: string;
}

export interface TooltipContextData {
  ctx?: TooltipContext2;
  setCtx: (c?: TooltipContext2) => void;
}

export const TooltipContext = React.createContext<TooltipContextData>(
  {} as TooltipContextData,
);
