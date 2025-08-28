import { EmbedProps } from "@/components";
import { useTranslation } from 'react-i18next';
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { IoDocument } from "react-icons/io5";
import { CiMail } from "react-icons/ci";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps title={t("contact_page.embedTitle")} description={t("contact_page.embedDescription")} />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h2>
          <strong className="editor-text-bold">{t("contact_page.contactsTitle")}</strong>
        </h2>
        <p>{t("contact_page.personName")}</p>
        <p>
          <strong>
            <IoDocument /> {t("contact_page.innLabel")}
          </strong>{" "}
          780220038930
        </p>
        <p>
          <strong>
            <CiMail /> {t("contact_page.emailLabel")}
          </strong>{" "}
        </p>
        <ul>
          <li>{t("contact_page.email1")}</li>
          <li>{t("contact_page.email2")}</li>
        </ul>

        <h2>
          <strong className="editor-text-bold">{t("contact_page.documentsTitle")}</strong>
        </h2>
        <br />
        <p>
          <a className="link" target="__blank" href="/privacy.pdf">
            {t("contact_page.policyText")}
          </a>
        </p>
        <p>
          <a className="link" target="__blank" href="/offer.pdf">
            {t("contact_page.offerText")}
          </a>
        </p>
      </div>
    </>
  );
}
