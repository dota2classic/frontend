import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";

export default function OfferPage() {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("offer_page.seo.title")}
        description={t("offer_page.seo.description")}
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
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
      </div>
    </>
  );
}
