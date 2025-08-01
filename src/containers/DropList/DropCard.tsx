import c from "@/containers/DropList/DropList.module.scss";
import { IconButton, Panel, Tooltipable } from "@/components";
import { FaTrashCan } from "react-icons/fa6";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { CountdownClient } from "@/components/PeriodicTimer/CountdownClient";
import { DroppedItemDto } from "@/api/back";
import React from "react";

interface Props {
  drop: DroppedItemDto;
  onDiscard: (item: DroppedItemDto) => Promise<void>;
}
export const DropCard = ({ drop, onDiscard }: Props) => {
  return (
    <Panel className={c.card} key={drop.assetId}>
      <Tooltipable className={c.discard} tooltip="Отказаться от награды">
        <IconButton onClick={() => onDiscard(drop)}>
          <FaTrashCan />
        </IconButton>
      </Tooltipable>
      <span className={cx(c.expires, threadFont.className)}>
        {drop.activeTradeId ? (
          <a
            className="link"
            target="__blank"
            href={`https://steamcommunity.com/tradeoffer/${drop.activeTradeId}/`}
          >
            Предложена к обмену
          </a>
        ) : (
          <>
            Истекает через <CountdownClient until={drop.expires} />
          </>
        )}
      </span>
      <picture>
        <img
          src={
            drop.item.image ||
            "https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttydbPaERSR0Wqmu7LAocGIyi3kajH_rdzcvuPXqe91lz4I_x-VXmWBjjjNno_CtJ4PS6YKF-LPGKC3WCj-8k5-I4HXDrzE4lsW7TzI2qJS2eOFUjCJYjEOQJtxDtmtfuP-Pm4FDAy9US7yb8m3g"
          }
          alt=""
        />
      </picture>
      <span className={cx(c.label, drop.item.quality, threadFont.className)}>
        {drop.item.marketHashName}
      </span>
      <span className={cx(c.type, drop.item.rarity, threadFont.className)}>
        {drop.item.rarity || "Unknown"}
      </span>
    </Panel>
  );
};
