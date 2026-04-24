import { FeedbackTemplateDto } from "@/api/back";
import { EditFeedbackTemplate } from "@/containers/EditFeedbackTemplate";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  feedback: FeedbackTemplateDto;
}
export default function EditFeedbackTemplatePage({ feedback }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        breadcrumbs={
          <>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              {t("feedback_page.feedback")}
            </PageLink>
            <span>{t("feedback_page.tag", { tag: feedback.tag })}</span>
          </>
        }
      />
      <EditFeedbackTemplate template={feedback} />
    </>
  );
}

EditFeedbackTemplatePage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<Props> => {
  const id = Number(ctx.query.id as string);
  return {
    feedback: await withTemporaryToken(ctx, () =>
      getApi().adminFeedback.adminFeedbackControllerGetFeedbackTemplate(id),
    ),
  };
};
