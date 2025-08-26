import c from "@/pages/admin/AdminStyles.module.scss";
import { FeedbackTemplateDto } from "@/api/back";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { Breadcrumbs, Button, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { useTranslation } from "react-i18next";

interface Props {
  feedbacks: FeedbackTemplateDto[];
}

export default function FeedbackList({ feedbacks }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              {t("feedback_list.feedback")}
            </PageLink>
          </Breadcrumbs>
        </div>
      </Panel>
      <div className={c.gridPanel}>
        <PageLink link={AppRouter.admin.feedback.create.link}>
          <Button>{t("feedback_list.create")}</Button>
        </PageLink>
        {feedbacks.map((feedback) => (
          <Panel className={c.feedback} key={feedback.tag}>
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
          </Panel>
        ))}
      </div>
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
