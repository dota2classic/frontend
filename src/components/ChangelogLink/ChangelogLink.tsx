import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./ChangelogLink.module.scss";
import { PageLink } from "@/components/PageLink";
import { AppRouter } from "@/route";

interface ChangelogLinkProps {
  patch: string;
}

export const ChangelogLink: React.FC<ChangelogLinkProps> = ({ patch }) => {
  const { t } = useTranslation();

  const routerLink = AppRouter.static.changelog.patch(patch).link;

  return (
    <PageLink link={routerLink}>
      <div className={styles.link}>
        <span className={styles.text}>{t("changelog.viewFull")}</span>
        <div className={styles.arrow}>→</div>
      </div>
    </PageLink>
  );
};
