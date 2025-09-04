import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { PlayerFeedbackPageDto } from "@/api/back";
import c from "../AdminStyles.module.scss";
import { AppRouter } from "@/route";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { Pagination } from "@/components/Pagination";
import { Panel } from "@/components/Panel";
import { UserPreview } from "@/components/UserPreview";

interface Props {
  page: PlayerFeedbackPageDto;
}
export default function PlayerFeedbackPage({ page }: Props) {
  const { t } = useTranslation();

  return (
    <div className={c.gridPanel}>
      <EmbedProps
        noindex
        title={t(`player_feedback.seo.title`)}
        description={t(`player_feedback.seo.description`)}
      />
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.admin.playerFeedback(pg).link}
      />
      {page.data.map((pf) => (
        <Panel key={pf.id} className={cx(c.grid6, c.playerFeedback)}>
          <h3>{t("player_feedback.title", { title: pf.title })}</h3>
          <header>
            <UserPreview user={pf.user} />
          </header>
          <p>{t("player_feedback.comment", { comment: pf.comment })}</p>
          <ul>
            {pf.options
              .filter((it) => it.checked)
              .map((option) => (
                <li key={option.id}>
                  {t("player_feedback.option", { option: option.option })}
                </li>
              ))}
          </ul>
        </Panel>
      ))}
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.admin.playerFeedback(pg).link}
      />
    </div>
  );
}

PlayerFeedbackPage.getInitialProps = async (ctx: NextPageContext) => {
  const page = numberOrDefault(ctx.query.page as string, 0);
  return {
    page: await withTemporaryToken(ctx, () =>
      getApi().adminFeedback.adminFeedbackControllerGetPlayerFeedback(page, 10),
    ),
  };
};
