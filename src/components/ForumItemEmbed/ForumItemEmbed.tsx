import React from "react";

import c from "./ForumItemEmbed.module.scss";
import { itemName } from "@/util/heroName";
import { AppRouter } from "@/route";
import cx from "clsx";
import { PageLink } from "../PageLink";
import { ItemIconRaw } from "../ItemIcon";

interface IForumItemEmbedProps {
  itemId: number;
  nolink?: boolean;
}

export const ForumItemEmbed: React.FC<IForumItemEmbedProps> = ({
  itemId,
  nolink,
}) => {
  const content = (
    <>
      <ItemIconRaw small item={itemId} />
      <span>{itemName(itemId)}</span>
    </>
  );

  return nolink ? (
    <a href="#" className={cx(c.heroEmbed)}>
      {content}
    </a>
  ) : (
    <PageLink
      className={cx(c.heroEmbed, "link")}
      link={AppRouter.items.item(itemId).link}
    >
      {content}
    </PageLink>
  );
};
