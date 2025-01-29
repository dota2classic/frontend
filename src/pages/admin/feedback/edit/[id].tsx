import { FeedbackTemplateDto } from "@/api/back";
import { EditFeedbackTemplate } from "@/containers";
import { Breadcrumbs, PageLink, Panel } from "@/components";
import { AppRouter } from "@/route";
import React from "react";
import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";

interface Props {
  feedback: FeedbackTemplateDto;
}
export default function EditFeedbackTemplatePage({ feedback }: Props) {
  return (
    <>
      <Panel>
        <div className="left">
          <Breadcrumbs>
            <PageLink link={AppRouter.admin.feedback.index.link}>
              Фидбек
            </PageLink>
            <span>{feedback.tag}</span>
          </Breadcrumbs>
        </div>
      </Panel>
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
