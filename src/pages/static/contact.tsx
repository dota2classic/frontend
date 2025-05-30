import { EmbedProps } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { IoDocument } from "react-icons/io5";
import { CiMail } from "react-icons/ci";

export default function ContactPage() {
  return (
    <>
      <EmbedProps title="Оферта dotaclassic.ru" description="Предложение" />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h2>
          <strong className="editor-text-bold">Контакты</strong>
        </h2>
        <p>
          <strong>
            <IoDocument /> ИНН:
          </strong>{" "}
          780220038930
        </p>
        <p>
          <strong>
            <CiMail /> Почта:
          </strong>{" "}
          adv@dotaclassic.ru
        </p>

        <h2>
          <strong className="editor-text-bold">Документы</strong>
        </h2>
        <br />
        <p>
          <a target="__blank" href="/privacy.pdf">
            Политика обработки персональных данных
          </a>
        </p>
      </div>
    </>
  );
}
