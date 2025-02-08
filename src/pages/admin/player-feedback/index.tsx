import { NextPageContext } from "next";
import { withTemporaryToken } from "@/util/withTemporaryToken";
import { getApi } from "@/api/hooks";
import { numberOrDefault } from "@/util/urls";
import { PlayerFeedbackPageDto } from "@/api/back";
import c from "../AdminStyles.module.scss";
import { Pagination, Panel, UserPreview } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";

interface Props {
  page: PlayerFeedbackPageDto;
}
export default function PlayerFeedbackPage({ page }: Props) {
  return (
    <div className={c.gridPanel}>
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.admin.playerFeedback(pg).link}
      />
      {page.data.map((pf) => (
        <Panel key={pf.id} className={cx(c.grid6, c.playerFeedback)}>
          <h3>{pf.title}</h3>
          <header>
            <UserPreview user={pf.user} />
          </header>
          <p>{pf.comment}</p>
          <ul>
            {pf.options
              .filter((it) => it.checked)
              .map((option) => (
                <li key={option.id}>{option.option}</li>
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
