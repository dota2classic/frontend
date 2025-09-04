import { EmbedProps } from "@/components/EmbedProps";
import { PageLink } from "@/components/PageLink";
import { Panel } from "@/components/Panel";
import { AppRouter } from "@/route";
import { useTranslation } from "react-i18next";

export default function SteamAuthError() {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("forbidden.accessDenied")}
        description={t("forbidden.noAccessRights")}
      />
      <Panel style={{ flexDirection: "column", padding: "24px" }}>
        <h1>{t("forbidden.noViewRights")}</h1>
        <p style={{ lineHeight: "1.5em" }}>
          <PageLink link={AppRouter.index.link}>
            {t("forbidden.returnHome")}
          </PageLink>
        </p>
        <img
          // style={{ width: "90%" }}
          src="/landing/4.png"
          alt="sobaka here"
        />
      </Panel>
    </>
  );
}
