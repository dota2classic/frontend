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

  const patchLabel =
    patch === "684d"
      ? t("changelog.page.patch_684d.title")
      : `Patch ${patch.toUpperCase()}`;

  const patchDescription =
    patch === "684d"
      ? t("changelog.page.patch_684d.description")
      : "View detailed patch notes";

  const routerLink = AppRouter.static.changelog.patch(patch).link;

  return (
    <PageLink link={routerLink}>
      <div className={styles.link}>
        <div className={styles.content}>
          <h3 className={styles.title}>{patchLabel}</h3>
          <p className={styles.description}>{patchDescription}</p>
        </div>
        <div className={styles.arrow}>→</div>
      </div>
    </PageLink>
  );
};
