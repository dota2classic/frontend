import React, { useRef, useState } from "react";
import { ItemMap } from "@/const/items";
import cx from "clsx";
import c from "@/components/ItemIcon/ItemIcon.module.scss";
import {
  bigImageStyles,
  IItemIconProps,
  smallImageStyles,
} from "@/components/ItemIcon/ItemIcon.props";
import { GenericTooltip, PlaceholderImage } from "@/components";
import { createPortal } from "react-dom";

export const ItemIconRaw: React.FC<IItemIconProps> = ({
  item,
  small,
  noTooltip,
}) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);
  const listener = useRef<(ev: MessageEvent) => void | null>(null);

  const handleResizeStuff = (e: HTMLIFrameElement | null) => {
    if (!e) {
      if (listener.current) {
        window.removeEventListener("message", listener.current);
      }
      return;
    }
    const _listener = (ev: MessageEvent) => {
      if (ev.data.type && ev.data.type === "resize-iframe") {
        if (ev.data.payload.height === 0) return;
        // e.style.width = ev.data.payload.width + "px";
        e.style.height = ev.data.payload.height + "px";
      }
    };
    window.addEventListener("message", _listener, false);
    listener.current = _listener;
  };

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

  const url = fItem.includes("empty")
    ? `/items/emptyitembg.webp`
    : fItem.includes("recipe")
      ? "/items/recipe.webp"
      : `/items/${fItem}.webp`;
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
              className={c.itemPreview}
              src={`https://wiki.dotaclassic.ru/slim/items/${item}?hideTree=true`}
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
        alt={`Item ${fItem}`}
        className={cx(c.item, { [c.small]: small })}
        src={url}
      />
    </>
  );
};
