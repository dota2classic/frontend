import { Surface } from "@/components/Surface";
import { useTranslation } from "react-i18next";

export default function SteamAuthError() {
  const { t } = useTranslation();
  return (
    <Surface padding="lg" style={{ flexDirection: "column" }} variant="panel">
      <h1>{t("steam_auth_error.steamNotResponding")}</h1>
      <p style={{ lineHeight: "1.5em" }}>
        {t("steam_auth_error.pleaseTryLater")}
        {t("steam_auth_error.steamSitesLostAccess")}
        {t("steam_auth_error.soonFixed")}
      </p>
      <img
        // style={{ width: "90%" }}
        src="/landing/4.png"
        alt="sobaka here"
      />
    </Surface>
  );
}
