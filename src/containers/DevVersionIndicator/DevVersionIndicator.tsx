import React from "react";

import c from "./DevVersionIndicator.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { NotoSans } from "@/const/notosans";
import { MaintenanceDto } from "@/api/back";
import { useTranslation } from "react-i18next";

interface Props {
  maintenance: MaintenanceDto;
}
export const DevVersionIndicator: React.FC<Props> = observer(
  ({ maintenance }) => {
    const { t } = useTranslation();
    const { auth } = useStore();
    const doShow = process.env.NEXT_PUBLIC_IS_DEV_VERSION;
    const { data, error } = getApi().statsApi.useStatsControllerMaintenance({
      refreshInterval: 5000,
      fallbackData: maintenance,
    });
    const isMaintenance = (data?.active || error) && !auth.isModerator;

    if (isMaintenance) {
      return (
        <div className={c.maintenance}>
          <h1 className="megaheading">
            {t("dev_version_indicator.siteUpdating")}
          </h1>
          <p className={NotoSans.className}>
            {" "}
            {t("dev_version_indicator.pleaseWait")}{" "}
          </p>
          <img src="/splash/kek.webp" alt="" />
        </div>
      );
    }

    if (!doShow) return null;

    return <div className={c.indicator}>{t("dev_version_indicator.dev")}</div>;
  },
);
