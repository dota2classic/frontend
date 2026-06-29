import React, { useCallback, useEffect, useRef, useState } from "react";

import c from "./DockNotice.module.scss";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { IoMdClose } from "react-icons/io";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { metrika } from "@/ym";

const SECONDARY_NOTICE_SHOWN = "SECONDARY_NOTICE_SHOWN";
const SECONDARY_NOTICE_HIDDEN = "SECONDARY_NOTICE_HIDDEN";
const SECONDARY_NOTICE_CLICK = "SECONDARY_NOTICE_CLICK";

const PRIMARY_NOTICE_SHOWN = "PRIMARY_NOTICE_SHOWN";
const PRIMARY_NOTICE_HIDDEN = "PRIMARY_NOTICE_HIDDEN";
const PRIMARY_NOTICE_CLICK = "PRIMARY_NOTICE_CLICK";

const INITIAL_ITEM_INDEX = 0;
const REAPPEAR_DELAY_MS = 60_000;

const FLOATING_ITEMS = [
  {
    id: "primary",
    href: "/r/a",
    displayDurationMs: 20_000,
    goals: {
      shown: PRIMARY_NOTICE_SHOWN,
      hidden: PRIMARY_NOTICE_HIDDEN,
      click: PRIMARY_NOTICE_CLICK,
    },
  },
  {
    id: "secondary",
    href: "/r/b",
    displayDurationMs: 10_000,
    goals: {
      shown: SECONDARY_NOTICE_SHOWN,
      hidden: SECONDARY_NOTICE_HIDDEN,
      click: SECONDARY_NOTICE_CLICK,
    },
  },
] as const;

export const FloatingNotice: React.FC = observer(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeItemIndex, setActiveItemIndex] = useState(INITIAL_ITEM_INDEX);
  const reappearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOld = useStore().auth.isOld;
  // const isOld = false;

  const activeItem = FLOATING_ITEMS[activeItemIndex];
  const isPrimaryItem = activeItem.id === "primary";

  useEffect(() => {
    if (isOld || !isVisible) return;

    metrika("reachGoal", activeItem.goals.shown);
  }, [activeItem.goals.shown, isOld, isVisible]);

  useEffect(() => {
    if (isOld || !isVisible || FLOATING_ITEMS.length < 2) return;

    const rotationTimeout = setTimeout(() => {
      setActiveItemIndex(
        (currentIndex) => (currentIndex + 1) % FLOATING_ITEMS.length,
      );
    }, activeItem.displayDurationMs);

    return () => clearTimeout(rotationTimeout);
  }, [activeItem.displayDurationMs, activeItemIndex, isOld, isVisible]);

  useEffect(() => {
    return () => {
      if (reappearTimeoutRef.current) {
        clearTimeout(reappearTimeoutRef.current);
      }
    };
  }, []);

  const close = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isVisible) return;
      metrika("reachGoal", activeItem.goals.hidden);
      setIsVisible(false);
      reappearTimeoutRef.current = setTimeout(
        () => setIsVisible(true),
        REAPPEAR_DELAY_MS,
      );
    },
    [activeItem.goals.hidden, isVisible],
  );

  if (isOld) return null;

  return (
    <div
      className={cx(
        c.shell,
        threadFont.className,
        isPrimaryItem ? c.primaryFrame : c.secondaryFrame,
        !isVisible && c.hidden,
      )}
    >
      <a
        href={activeItem.href}
        target="_blank"
        rel="noopener"
        className={c.link}
        aria-label="Открыть предложение"
        onClick={() => metrika("reachGoal", activeItem.goals.click)}
      >
        {isPrimaryItem ? <PrimaryPanel /> : <SecondaryPanel />}
      </a>

      <button
        type="button"
        onClick={close}
        className={c.closeButton}
        aria-label="Скрыть блок"
      >
        <IoMdClose />
      </button>
    </div>
  );
});

const SecondaryPanel = () => (
  <div className={cx(c.surface, c.secondarySurface)}>
    <div className={c.secondaryBackdrop} />
    <div className={c.secondaryVeil} />
    <div className={c.secondaryContent}>
      <img
        className={c.secondaryMark}
        src="/img/spotlight-mark-b.webp"
        alt=""
      />
      <div className={c.secondaryCopy}>
        <span className={c.secondaryKicker}>Collector's shop</span>
        <span className={c.secondaryTitle}>Редкие Dota-предметы</span>
        <span className={c.secondarySubtitle}>
          Immortal, наборы и коллекции
        </span>
      </div>
      <span className={c.secondaryAction}>
        <span className={c.secondaryActionWide}>Присоединяйся!</span>
        <span className={c.secondaryActionCompact}>Редкие предметы</span>
      </span>
    </div>
  </div>
);

const PrimaryPanel = () => (
  <div className={cx(c.surface, c.primarySurface)}>
    <div className={c.primaryBackdrop} />
    <div className={c.primaryVeil} />
    <div className={c.primaryContent}>
      <img className={c.primaryMark} src="/img/spotlight-mark-a.webp" alt="" />
      <div className={c.primaryOffer}>
        <span className={c.primaryTitle}>5×1000₽</span>
        <span className={c.primarySubtitle}>новым игрокам</span>
      </div>
      <span className={c.primaryAction}>Забрать</span>
      <span className={c.primaryLimit}>18+</span>
    </div>
  </div>
);
