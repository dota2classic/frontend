import { EditProductContainer } from "@/containers";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

export default function CreateProductPage() {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.store.index.link}>Товар</PageLink>
            <span>Создать новый твар</span>
          </Breadcrumbs>
        </div>
      </Panel>
      <EditProductContainer />
    </>
  );
}
