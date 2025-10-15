import React, { useCallback, useRef, useState } from "react";
import { ItemMap } from "@/const/items";
import cx from "clsx";
import c from "./ItemIcon.module.scss";
import {
  bigImageStyles,
  IItemIconProps,
  smallImageStyles,
} from "./ItemIcon.props";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { GenericTooltip } from "../GenericTooltip";
import { PlaceholderImage } from "./PlaceholderImage";

export const ItemIconRaw: React.FC<IItemIconProps> = React.memo(
  function ItemIconRaw({ item, small, noTooltip }) {
    const { t } = useTranslation();
    const ref = useRef<HTMLImageElement | null>(null);
    const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);
    const listener = useRef<(ev: MessageEvent) => void | null>(null);

    const BASE_URL = process.env.WIKI_URL;

    const onIframeLoad = useCallback(
      (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        const target = e.currentTarget.contentWindow;
        if (!target) return;

        const msg = {
          type: "sync-route",
          route: `/slim/items/${item}?hideTree=true`,
        };
        target.postMessage(msg, BASE_URL);
      },
      [item],
    );

    const handleResizeStuff = useCallback((e: HTMLIFrameElement | null) => {
      if (!e) {
        if (listener.current) {
          window.removeEventListener("message", listener.current);
        }
        return;
      }
      const _listener = (ev: MessageEvent) => {
        if (ev.data.type && ev.data.type === "resize-iframe-popup") {
          if (ev.data.payload.height === 0) return;
          e.style.height = ev.data.payload.height + "px";
        }
      };
      window.addEventListener("message", _listener, false);
      listener.current = _listener;
    }, []);

    const fItem =
      typeof item === "number"
        ? ItemMap.find((it) => it.id === item)!.name
        : item.replace("item_", "");

    if (fItem.includes("empty"))
      return (
        <PlaceholderImage
          width={small ? smallImageStyles.width : bigImageStyles.width}
          height={small ? smallImageStyles.height : bigImageStyles.height}
        />
      );

    const url = fItem.includes("recipe")
      ? "/items/recipe_lg.webp"
      : `/items/${fItem}_lg.webp`;
    return (
      <>
        {tooltipRef &&
          !noTooltip &&
          createPortal(
            <GenericTooltip
              anchor={tooltipRef}
              onClose={() => setTooltipRef(null)}
            >
              <iframe
                ref={handleResizeStuff}
                src={`${BASE_URL}/slim/items/${item}?hideTree=true`}
                className={c.itemPreview}
                onLoad={onIframeLoad}
              ></iframe>
            </GenericTooltip>,
            document.body,
          )}
        <img
          data-item-id={item}
          ref={ref}
          onMouseEnter={(e) => setTooltipRef(e.target as HTMLElement)}
          onMouseLeave={() => setTooltipRef(null)}
          width={small ? smallImageStyles.width : bigImageStyles.width}
          height={small ? smallImageStyles.height : bigImageStyles.height}
          alt={t("item_icon.itemAltText", { fItem })}
          className={cx(c.item, { [c.small]: small })}
          src={url}
        />
      </>
    );
  },
);
