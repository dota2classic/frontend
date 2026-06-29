import React, { useCallback, useEffect, useRef, useState } from "react";

import c from "./FloaterAd.module.scss";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { IoMdClose } from "react-icons/io";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { metrika } from "@/ym";

const COLLECTORSHOP_AD_SHOWN = "COLLECTORSHOP_AD_SHOWN";
const COLLECTORSHOP_AD_HIDDEN = "COLLECTORSHOP_AD_HIDDEN";
const COLLECTORSHOP_AD_CLICK = "COLLECTORSHOP_AD_CLICK";

const PARI_AD_SHOWN = "PARI_AD_SHOWN";
const PARI_AD_HIDDEN = "PARI_AD_HIDDEN";
const PARI_AD_CLICK = "PARI_AD_CLICK";

const INITIAL_AD_INDEX = 0;
const REAPPEAR_DELAY_MS = 60_000;

const FLOATER_ADS = [
  {
    id: "pari",
    href: "https://clicks.af-pb06e2.com/click?offer_id=802&partner_id=32902&landing_id=571&utm_medium=affiliate",
    displayDurationMs: 20_000,
    goals: {
      shown: PARI_AD_SHOWN,
      hidden: PARI_AD_HIDDEN,
      click: PARI_AD_CLICK,
    },
  },
  {
    id: "collectors",
    href: "https://collectorsshop.ru/promo/old",
    displayDurationMs: 10_000,
    goals: {
      shown: COLLECTORSHOP_AD_SHOWN,
      hidden: COLLECTORSHOP_AD_HIDDEN,
      click: COLLECTORSHOP_AD_CLICK,
    },
  },
] as const;

export const FloaterAd: React.FC = observer(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeAdIndex, setActiveAdIndex] = useState(INITIAL_AD_INDEX);
  const reappearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOld = useStore().auth.isOld;
  // const isOld = false;

  const activeAd = FLOATER_ADS[activeAdIndex];

  useEffect(() => {
    if (isOld || !isVisible) return;

    metrika("reachGoal", activeAd.goals.shown);
  }, [activeAd.goals.shown, isOld, isVisible]);

  useEffect(() => {
    if (isOld || !isVisible || FLOATER_ADS.length < 2) return;

    const rotationTimeout = setTimeout(() => {
      setActiveAdIndex(
        (currentIndex) => (currentIndex + 1) % FLOATER_ADS.length,
      );
    }, activeAd.displayDurationMs);

    return () => clearTimeout(rotationTimeout);
  }, [activeAd.displayDurationMs, activeAdIndex, isOld, isVisible]);

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
      metrika("reachGoal", activeAd.goals.hidden);
      setIsVisible(false);
      reappearTimeoutRef.current = setTimeout(
        () => setIsVisible(true),
        REAPPEAR_DELAY_MS,
      );
    },
    [activeAd.goals.hidden, isVisible],
  );

  if (isOld) return null;

  return (
    <div
      className={cx(
        c.interesting,
        threadFont.className,
        !isVisible && c.hidden,
      )}
    >
      <a
        href={activeAd.href}
        target="_blank"
        rel="noreferrer"
        className={c.link}
        onClick={() => metrika("reachGoal", activeAd.goals.click)}
      >
        {activeAd.id === "pari" ? <PariAd /> : <CollectorsAd />}
      </a>

      <button
        type="button"
        onClick={close}
        className={c.closeButton}
        aria-label="Скрыть рекламу"
      >
        <IoMdClose />
      </button>
    </div>
  );
});

const CollectorsAd = () => (
  <div className={cx(c.adBody, c.collectorsBody)}>
    <img className={c.img} src="/collectors.webp" alt="" />
    <div className={c.text}>
      <span className={c.title}>Collector's shop</span>
      <span className={c.description}>
        Коллекционные наборы, Immortal-предметы и другие ценные вещи — всё в
        одном месте.
      </span>
    </div>
  </div>
);

const PariAd = () => (
  <div className={cx(c.adBody, c.pariBody)}>
    <div className={c.pariBackground} />
    <div className={c.pariShade} />
    <div className={c.pariContent}>
      <img className={c.pariLogo} src="/img/pari-logo-dota.webp" alt="PARI" />
      <div className={c.pariOffer}>
        <span className={c.pariTitle}>Фрибет 5×1000₽</span>
        <span className={c.pariSubtitle}>новым игрокам</span>
      </div>
      <span className={c.pariCta}>Забрать</span>
      <span className={c.pariAge}>18+</span>
    </div>
  </div>
);
