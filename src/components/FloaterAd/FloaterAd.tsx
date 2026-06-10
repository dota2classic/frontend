import React, { useCallback, useEffect, useState } from "react";

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

export const FloaterAd: React.FC = observer(() => {
  const [isVisible, setIsVisible] = useState(true);

  const isOld = useStore().auth.isOld;
  // const isOld = false;

  useEffect(() => {
    if (isOld || !isVisible) return;

    metrika("reachGoal", COLLECTORSHOP_AD_SHOWN);
  }, [isOld, isVisible]);

  const close = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isVisible) return;
      metrika("reachGoal", COLLECTORSHOP_AD_HIDDEN);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 60_000);
    },
    [isVisible],
  );

  if (isOld) return null;

  return (
    <a
      href="https://collectorsshop.ru/promo/old"
      target="_blank"
      className={cx(
        c.interesting,
        threadFont.className,
        !isVisible && c.hidden,
      )}
      onClick={() => metrika("reachGoal", COLLECTORSHOP_AD_CLICK)}
    >
      <img className={c.img} src="/collectors.webp" alt="" />
      <div className={c.text}>
        <span className={c.title}>Collector's shop</span>
        <span className={c.description}>
          Коллекционные наборы, Immortal-предметы и другие ценные вещи — всё в
          одном месте.
        </span>

        <button onClick={close} className={c.closeButton}>
          <IoMdClose />
        </button>
      </div>
    </a>
  );
});
