import { NextPageContext } from "next";
import { parsePage } from "@/util/urls";
import { PlayerFeedbackPageDto } from "@/api/back";
import c from "../AdminStyles.module.scss";
import { AppRouter } from "@/route";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import { EmbedProps } from "@/components/EmbedProps";
import { Pagination } from "@/components/Pagination";
import { UserPreview } from "@/components/UserPreview";
import { Surface } from "@/components/Surface";
import { PageGrid, PageGridItem } from "@/components/PageGrid";
import { getRequestApi } from "@/api/request-api";

interface Props {
  page: PlayerFeedbackPageDto;
}
export default function PlayerFeedbackPage({ page }: Props) {
  const { t } = useTranslation();

  return (
    <PageGrid gap={12}>
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
        <PageGridItem key={pf.id} span={6}>
          <Surface
            className={cx(c.playerFeedback)}
            padding="xs"
            variant="panel"
          >
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
          </Surface>
        </PageGridItem>
      ))}
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.admin.playerFeedback(pg).link}
      />
    </PageGrid>
  );
}

PlayerFeedbackPage.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  const page = parsePage(ctx.query.page);
  return {
    page: await api.adminFeedback.adminFeedbackControllerGetPlayerFeedback(
      page,
      10,
    ),
  };
};
