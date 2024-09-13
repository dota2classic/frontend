import { PageLink } from "@/components";
import { AppRouter } from "@/route";

export default function Error500({ statusCode }) {
  return (
    <>
      <h1>Возникла ошибка при загрузке страницы {statusCode}</h1>
      <PageLink link={AppRouter.index.link}>
        <h3 className="green">Вернуться на главную</h3>
      </PageLink>
    </>
  );
}
