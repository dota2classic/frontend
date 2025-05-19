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
        <h1 id="-">
          <strong className="editor-text-bold">Контакты</strong>
        </h1>
        <p>
          <IoDocument /> ИНН 780220038930
        </p>
        <p>
          <CiMail /> adv@dotaclassic.ru
        </p>
        {/*<img src={"/logo3.png"} width={"50%"} />*/}
      </div>
    </>
  );
}
