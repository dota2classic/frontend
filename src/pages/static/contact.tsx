import { useTranslation } from "react-i18next";
import { IoDocument } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { StaticPageShell } from "@/components/StaticPageShell";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      eyebrow="Support"
      title={t("contact_page.contactsTitle")}
      description={t("contact_page.seo.description")}
      embedTitle={t("contact_page.seo.title")}
      embedDescription={t("contact_page.seo.description")}
    >
      <h2>
        <strong className="editor-text-bold">
          {t("contact_page.contactsTitle")}
        </strong>
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
        <strong className="editor-text-bold">
          {t("contact_page.documentsTitle")}
        </strong>
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
    </StaticPageShell>
  );
}
