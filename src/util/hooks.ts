import React from "react";

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
