import { EditFeedbackTemplate } from "@/containers";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";

export default function CreateFeedback() {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              Фидбек
            </PageLink>
            <span>Создать новый фидбек</span>
          </Breadcrumbs>
        </div>
      </Panel>
      <EditFeedbackTemplate />
    </>
  );
}
