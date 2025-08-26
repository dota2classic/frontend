import { Panel } from "@/components";

export default function SteamAuthError() {
  return (
    <Panel style={{ flexDirection: "column", padding: "24px" }}>
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
    </Panel>
  );
}
