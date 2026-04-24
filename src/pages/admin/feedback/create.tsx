import { EditFeedbackTemplate } from "@/containers/EditFeedbackTemplate";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import React from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

export default function CreateFeedback() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        breadcrumbs={
          <>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              {t("create_feedback.feedback")}
            </PageLink>
            <span>{t("create_feedback.createNewFeedback")}</span>
          </>
        }
      />
      <EditFeedbackTemplate />
    </>
  );
}
