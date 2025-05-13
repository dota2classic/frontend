import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import c from "./GenericTooltip.module.scss";
import cx from "clsx";
import useOutsideClick from "@/util/useOutsideClick";

interface Position {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

const calculateModalPosition = (
  anchor: HTMLElement | null,
  modal: HTMLElement | null,
): Position | undefined => {
  if (!anchor || !modal || typeof window === "undefined") return undefined;
  if (!document.body.contains(anchor)) return undefined;

  const rect = anchor.getBoundingClientRect();

  const windowHeight = modal.clientHeight;
  const windowWidth = modal.clientWidth;

  const scrollY = window.scrollY;

  const wb = window.innerHeight;

  const top = Math.min(
    scrollY + (wb - windowHeight - 12),
    rect.top + rect.height + 8,
  );

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
  friends?: React.RefObject<HTMLElement | null>[];
  interactable?: boolean;
}

export const GenericTooltip: React.FC<
  PropsWithChildren<IGenericTooltipProps>
> = ({ children, anchor, interactable, friends, onClose }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const repositionModal = useCallback(
    (e: HTMLDivElement) => {
      const position = calculateModalPosition(anchor, e);
      if (!position) {
        e.style.display = "none";
      } else {
        e.style.display = "block";
        e.style.left = position.left + "px";
        e.style.top = position.top + "px";
      }
    },
    [anchor],
  );

  useOutsideClick(onClose, containerRef, friends);

  useEffect(() => {
    const r = containerRef.current;
    if (!r) return;
    const listener = (entries: ResizeObserverEntry[]) => {
      repositionModal(entries[0].target as HTMLDivElement);
    };

    const observer = new ResizeObserver(listener);
    observer.observe(r);

    return () => observer.disconnect();
  }, [containerRef, repositionModal]);

  return (
    <div
      className={cx(c.tooltip, !interactable && c.tooltip__ephermal)}
      ref={(e) => {
        containerRef.current = e;
        if (!e) return;
        repositionModal(e);
      }}
    >
      {children}
    </div>
  );
};
