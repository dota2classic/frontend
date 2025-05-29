import { NextPageContext } from "next";
import { numberOrDefault } from "@/util/urls";
import { PunishmentLogPageDto } from "@/api/back";
import { getApi } from "@/api/hooks";
import {
  Duration,
  EmbedProps,
  PageLink,
  Pagination,
  Table,
  TimeAgo,
  UserPreview,
} from "@/components";
import { AppRouter } from "@/route";

interface Props {
  page: PunishmentLogPageDto;
}
export default function BanLog({ page }: Props) {
  return (
    <>
      <EmbedProps
        title={"Журнал нарушений"}
        description={"Журнал нарушений правил на сайте dotaclassic.ru "}
      />
      <Pagination
        page={page.page}
        maxPage={page.pages}
        linkProducer={(pg) => AppRouter.banLog.index(pg).link}
      />
      <Table>
        <thead>
          <tr>
            <th>Дата наказания</th>
            <th>Длительность бана</th>
            <th>Правило</th>
            <th>Нарушитель</th>
            <th>Исполнитель</th>
          </tr>
        </thead>
        <tbody>
          {page.data.map((log) => (
            <tr key={log.id}>
              <td>
                <TimeAgo date={log.createdAt} />
              </td>
              <td>
                {log.duration > 60 * 60 * 24 * 1000 ? (
                  "Пермабан"
                ) : (
                  <Duration duration={log.duration} long />
                )}
              </td>
              <td>
                <PageLink link={AppRouter.rules2.rule(log.rule.id).link}>
                  {log.rule.title}
                </PageLink>
              </td>
              <td>
                <UserPreview user={log.reported} />
              </td>
              <td>
                <UserPreview user={log.executor} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

BanLog.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const page = numberOrDefault(ctx.query.page as string, 0);

  return {
    page: await getApi().report.reportControllerGetPaginationLog(page),
  };
};
