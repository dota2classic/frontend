import { EditFeedbackTemplate } from "@/containers/EditFeedbackTemplate";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageLink } from "@/components/PageLink";
import { Panel } from "@/components/Panel";
import { AppRouter } from "@/route";
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
