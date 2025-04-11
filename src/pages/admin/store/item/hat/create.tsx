import { EditHatContainer, EditProductContainer } from "@/containers";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

export default function CreateHatPage() {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.store.index.link}>Товар</PageLink>
            <span>Новая шапка</span>
          </Breadcrumbs>
        </div>
      </Panel>
      <EditHatContainer />
    </>
  );
}
