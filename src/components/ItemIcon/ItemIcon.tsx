import React from "react";
import { PageLink } from "../PageLink";
import { AppRouter } from "@/route";
import { ItemIconRaw } from "./ItemIconRaw";
import { asItemId, IItemIconProps } from "./ItemIcon.props";

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  return (
    <PageLink link={AppRouter.items.item(asItemId(item)).link}>
      <ItemIconRaw item={item} small={small} />
    </PageLink>
  );
};
