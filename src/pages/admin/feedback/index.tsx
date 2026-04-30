import c from "@/pages/admin/AdminStyles.module.scss";
import { FeedbackTemplateDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { useTranslation } from "react-i18next";
import { PageLink } from "@/components/PageLink";
import { Button } from "@/components/Button";
import { Surface } from "@/components/Surface";
import { PageHeader } from "@/components/PageHeader";
import { PageGrid } from "@/components/PageGrid";

interface Props {
  feedbacks: FeedbackTemplateDto[];
}

export default function FeedbackList({ feedbacks }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        breadcrumbs={
          <PageLink link={AppRouter.admin.feedback.index.link}>
            {t("feedback_list.feedback")}
          </PageLink>
        }
      />
      <PageGrid className={c.gridPanel} gap={12}>
        <Button pageLink={AppRouter.admin.feedback.create.link}>
          {t("feedback_list.create")}
        </Button>
        {feedbacks.map((feedback) => (
          <Surface
            className={c.feedback}
            key={feedback.tag}
            padding="xs"
            variant="panel"
          >
            <div>
              <h2>{feedback.tag}</h2>
              <PageLink link={AppRouter.admin.feedback.edit(feedback.id).link}>
                {feedback.title}
              </PageLink>
            </div>
            <Button
              className="red"
              onClick={() =>
                getApi().adminFeedback.adminFeedbackControllerDeleteFeedback(
                  feedback.id,
                )
              }
            >
              {t("feedback_list.delete")}
            </Button>
          </Surface>
        ))}
      </PageGrid>
    </>
  );
}

FeedbackList.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  return {
    feedbacks: await withTemporaryToken(ctx, () =>
      getApi().adminFeedback.adminFeedbackControllerGetFeedbacks(),
    ),
  };
};
