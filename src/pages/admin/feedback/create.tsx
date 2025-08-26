import { EditFeedbackTemplate } from "/@/containers";
import { Breadcrumbs, PageLink, Panel } from "/@/components";
import { AppRouter } from "/@/route";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CreateFeedback() {
  const { t } = useTranslation();

  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              {t("create_feedback.feedback")}
            </PageLink>
            <span>{t("create_feedback.createNewFeedback")}</span>
          </Breadcrumbs>
        </div>
      </Panel>
      <EditFeedbackTemplate />
    </>
  );
}
