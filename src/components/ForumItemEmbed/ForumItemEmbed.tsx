import React, { PropsWithChildren } from "react";

import { ItemIconRaw, PageLink } from "..";

import c from "./ForumItemEmbed.module.scss";
import { itemName } from "@/util/heroName";
import { AppRouter } from "@/route";
import cx from "clsx";

interface IForumItemEmbedProps {
  itemId: number;
  nolink?: boolean;
}

export const ForumItemEmbed: React.FC<IForumItemEmbedProps> = ({
  itemId,
  nolink,
}) => {
  const RootComponent: React.FC = nolink
    ? (p: PropsWithChildren<{ className?: string }>) =>
        React.createElement("a", { ...p, href: "#" })
    : PageLink;
  return (
    <RootComponent
      link={AppRouter.items.item(itemId).link}
      className={cx(c.heroEmbed, "link")}
    >
      <ItemIconRaw small item={itemId} />
      <span>{itemName(itemId)}</span>
    </RootComponent>
  );
};
