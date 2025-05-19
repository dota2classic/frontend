import { EmbedProps, PageLink } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { AppRouter } from "@/route";

export default function OfferPage() {
  return (
    <>
      <EmbedProps title="Оферта dotaclassic.ru" description="Предложение" />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h1 id="-">
          <strong className="editor-text-bold">Оферта</strong>
        </h1>
        <p className="editor-paragraph">
          <span className={c.part}>5.3.1</span>. Публикация личной информации
          других участников сообщества без их согласия запрещена.
          <br />
          <span className={c.part}>5.3.2</span>. Администрация обязуется
          использовать данные пользователей исключительно для нужд сообщества
          (например, при разбирательствах или для статистики) и защищать их от
          утечек.
        </p>
        <p>
          С полным регламентом можно ознакомиться{" "}
          <PageLink link={AppRouter.fullRules.link}>по ссылке</PageLink>
        </p>
      </div>
    </>
  );
}
