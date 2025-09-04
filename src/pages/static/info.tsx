import { EmbedProps } from "@/components/EmbedProps";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";

export default function InfoPage() {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("info_page.seo.title")}
        description={t("info_page.seo.description")}
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("info_page.siteEssence")}
        </h2>
        <p>{t("info_page.onlineOldDotaExplanation")}</p>
        <p>{t("info_page.freeOldDotaOpportunity")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("info_page.whyOldDota")}
        </h2>
        <p>{t("info_page.differencesExplanation")}</p>
        <ul>
          <li>{t("info_page.oldMapDetails")}</li>
          <li>{t("info_page.heroStatsDetails")}</li>
          <li>{t("info_page.originalHeroesDetails")}</li>
          <li>{t("info_page.roleSeparationDetails")}</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("info_page.costToMaintainSite")}
        </h2>
        <p>{t("info_page.expensesExplanation")}</p>
        <ul>
          <li>{t("info_page.fixedExpenseDetails", { amount: "2000₽" })}</li>
          <li>{t("info_page.scalableExpenseDetails", { amount: "±520₽" })}</li>
          <li>{t("info_page.advertExpenseDetails")}</li>
        </ul>
        <p>
          {t("info_page.approximateExpenses", {
            lowOnline: "3500₽",
            highOnline: "10000₽",
          })}
        </p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("info_page.projectTeam")}
        </h2>
        <p>{t("info_page.projectHistoryExplanation")}</p>
        <ul>
          <li>
            {t("info_page.developerDetails", {
              name: "Itachi / Psychology Professor",
            })}
          </li>
          <li>{t("info_page.communityManagerDetails", { name: "RX" })}</li>
          <li>{t("info_page.wikiDeveloperDetails", { name: "V" })}</li>
        </ul>
        <p>{t("info_page.contributorsList")}</p>
        <ul>
          <li>{t("info_page.ancient678Details")}</li>
          <li>{t("info_page.samovarDetails")}</li>
          <li>{t("info_page.sittingBullDetails")}</li>
          <li>{t("info_page.deathTBODetails")}</li>
          <li>{t("info_page.alisonDetails")}</li>
          <li>{t("info_page.konakonaqqDetails")}</li>
          <li>{t("info_page.otherContributors")}</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("info_page.finalGoal")}
        </h2>
        <p>{t("info_page.stableOnlineGoal")}</p>
      </div>
    </>
  );
}
