import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";
import { StaticPageShell } from "@/components/StaticPageShell";
import c from "@/pages/static/rules/RulesPage.module.scss";

export default function OfferPage() {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      eyebrow="Legal"
      title={t("offer_page.offer")}
      description={t("offer_page.seo.description")}
      embedTitle={t("offer_page.seo.title")}
      embedDescription={t("offer_page.seo.description")}
    >
      <h1 id="-">
        <strong className="editor-text-bold">{t("offer_page.offer")}</strong>
      </h1>
      <p className="editor-paragraph">
        <span className={c.part}>5.3.1</span>.{" "}
        {t("offer_page.publicationPolicy")}
        <br />
        <span className={c.part}>5.3.2</span>.{" "}
        {t("offer_page.administrationObligation")}
      </p>
      <p>
        {t("offer_page.regulationDetails")}{" "}
        <PageLink link={AppRouter.fullRules.link}>
          {t("offer_page.linkText")}
        </PageLink>
      </p>
    </StaticPageShell>
  );
}
