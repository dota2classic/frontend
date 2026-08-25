import { useTranslation } from "react-i18next";
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
      {null}
    </StaticPageShell>
  );
}
