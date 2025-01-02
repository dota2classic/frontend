import React from "react";
import { PageLink } from "@/components";
import { AppRouter } from "@/route";
import { ItemIconRaw } from "@/components/ItemIcon/ItemIconRaw";
import { asItemId, IItemIconProps } from "@/components/ItemIcon/ItemIcon.props";

export const ItemIcon: React.FC<IItemIconProps> = ({ item, small }) => {
  return (
    <PageLink link={AppRouter.items.item(asItemId(item)).link}>
      <ItemIconRaw item={item} small={small} />
    </PageLink>
  );
};
