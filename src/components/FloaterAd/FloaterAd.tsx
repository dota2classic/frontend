import React, { useCallback, useState } from "react";

import c from "./FloaterAd.module.scss";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { IoMdClose } from "react-icons/io";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";

export const FloaterAd: React.FC = observer(() => {
  const [isVisible, setIsVisible] = useState(true);

  const isOld = useStore().auth.isOld;
  // const isOld = false;

  const close = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isVisible) return;
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
