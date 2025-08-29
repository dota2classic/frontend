import { EmbedProps } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { TrajanPro } from "@/const/fonts";
import { Trans, useTranslation } from "react-i18next";

export default function VacanciesPage() {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("vacancies_page.seo.title")}
        description={t("vacancies_page.seo.description")}
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
        <h1 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.whoWeNeed")}
        </h1>
        <p>
          <Trans
            i18nKey="vacancies_page.projectIntro"
            values={{
              project: "dotaclassic",
            }}
            components={{
              project: <span className="red" />,
            }}
          ></Trans>
        </p>
        <p>{t("vacancies_page.volunteerNote")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.productManager")}
        </h2>
        <p>{t("vacancies_page.productManagerDescription")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.contentManager")}
        </h2>
        <p>{t("vacancies_page.contentManagerDescription")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.productAnalyst")}
        </h2>
        <p>{t("vacancies_page.productAnalystDescription")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.frontendDev")}
        </h2>
        <p>{t("vacancies_page.frontendDevDescription")}</p>
        <p>{t("vacancies_page.expectedSkills")}</p>
        <ul>
          <li>React, Typescript</li>
          <li>SASS/SCSS</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.uiDesigner")}
        </h2>
        <p>{t("vacancies_page.uiDesignerDescription")}</p>
        <p>{t("vacancies_page.expectedSkills")}</p>
        <ul>
          <li>{t("vacancies_page.layoutAndComponentSystem")}</li>
          <li>Figma</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.devops")}
        </h2>
        <p>{t("vacancies_page.devopsDescription")}</p>
        <p>{t("vacancies_page.expectedSkills")}</p>
        <ul>
          <li>OS Linux, Bash</li>
          <li>Docker, Docker-Compose</li>
          <li>Nginx</li>
          <li>VPN</li>
          <li>Ansible</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.backendDev")}
        </h2>
        <p>{t("vacancies_page.backendDevDescription")}</p>
        <p>{t("vacancies_page.expectedSkills")}</p>
        <ul>
          <li>NodeJS, Typescript</li>
          <li>NestJS/Express/Koa</li>
          <li>PostgreSQL, Typeorm</li>
          <li>Jest</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.srcdsDev")}
        </h2>
        <p>{t("vacancies_page.srcdsDevDescription")}</p>
        <p>{t("vacancies_page.expectedSkills")}</p>
        <ul>
          <li>Sourcepawn</li>
          <li>Lua</li>
          <li>Hammer</li>
          <li>Metamod</li>
          <li>Sourcemod</li>
        </ul>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.discordModerator")}
        </h2>
        <p>{t("vacancies_page.discordModeratorDescription")}</p>
        <h2 className={cx(TrajanPro.className, "megaheading")}>
          {t("vacancies_page.contactUs")}
        </h2>
        <p>
          <a className={"link"} href="https://t.me/enchantinggg4">
            t.me/enchantinggg4
          </a>{" "}
          - {t("vacancies_page.contactInstruction")}
        </p>
      </div>
    </>
  );
}
