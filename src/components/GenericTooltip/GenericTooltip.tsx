import React, { PropsWithChildren, useRef } from "react";
import c from "./GenericTooltip.module.scss";

interface Position {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

const calculateModalPosition = (
  anchor: HTMLElement | null,
  modal: HTMLElement | null,
): Position => {
  if (!anchor || !modal || typeof window === "undefined") return {};

  const rect = anchor.getBoundingClientRect();

  const windowHeight = modal.clientHeight;
  const windowWidth = modal.clientWidth;

  const scrollY = window.scrollY;

  const wb = window.innerHeight;

  const top = Math.min(scrollY + (wb - windowHeight - 12), rect.top - 3);

  let left = rect.left - windowWidth;
  if (left < 0) {
    // no-no
    left = 12;
  }

  return {
    left,
    top,
  };
};

interface IGenericTooltipProps {
  onClose: () => void;
  anchor: HTMLElement;
}

export const GenericTooltip: React.FC<
  PropsWithChildren<IGenericTooltipProps>
> = ({ children, anchor }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={c.tooltip}
      ref={(e) => {
        containerRef.current = e;
        if (!e) return;
        const position = calculateModalPosition(anchor, e);
        e.style.left = position.left + "px";
        e.style.top = position.top + "px";
      }}
    >
      {children}
    </div>
  );
};
