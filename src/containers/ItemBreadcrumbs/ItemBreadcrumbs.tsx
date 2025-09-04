import React, { useMemo } from "react";
import { AppRouter } from "@/route";
import { ItemMap } from "@/const/items";
import { ItemData } from "@/const/itemdata";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/Panel";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";

interface IItemBreadcrumbsProps {
  itemId: number | undefined;
}

export const ItemBreadcrumbs: React.FC<IItemBreadcrumbsProps> = ({
  itemId,
}) => {
  const { t } = useTranslation();

  const itemName = useMemo(() => {
    if (itemId === undefined) return undefined;
    const itemName = ItemMap.find((t) => t.id === itemId)?.name;
    return ItemData.find((t) => {
      return t.item_name === "item_" + itemName;
    })?.name;
  }, [itemId]);
  return (
    <Panel>
      <div className="left">
        <Breadcrumbs>
          <PageLink link={AppRouter.items.index.link}>
            {t("item_breadcrumbs.items")}
          </PageLink>
          {itemId !== undefined && (
            <PageLink link={AppRouter.items.item(itemId).link}>
              {itemName}
            </PageLink>
          )}
        </Breadcrumbs>
      </div>
    </Panel>
  );
};
