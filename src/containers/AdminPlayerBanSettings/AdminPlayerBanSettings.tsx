import React from "react";

import c from "./AdminPlayerBanSettings.module.scss";
import { Button, Input, Panel } from "@/components";
import { getApi } from "@/api/hooks";
import { AdminRuleViolationContainer } from "@/containers";
import cx from "clsx";
import DatePicker from "react-datepicker";
import { isInFuture } from "@/util/time";
import { useAsyncButton } from "@/util/use-async-button";
import { useTranslation } from "react-i18next";

interface IAdminPlayerBanSettingsProps {
  steamId: string;
}

export const AdminPlayerBanSettings: React.FC<IAdminPlayerBanSettingsProps> = ({
  steamId,
}) => {
  const { data, mutate } =
    getApi().adminApi.useAdminUserControllerBanOf(steamId);

  const [isSettingDate, setBanDate] = useAsyncButton(
    async (d: Date | null) => {
      if (!data) return null;
      await getApi().adminApi.adminUserControllerBanId(steamId, {
        reason: data.banStatus.status,
        endTime: d ? d.toISOString() : new Date(0).toISOString(),
      });
      await mutate();
    },
    [data, mutate],
  );

  const { t } = useTranslation();

  return (
    <Panel className={c.container}>
      {data ? (
        <>
          <div className={"nicerow"}>
            <p>{t("admin_player_ban_settings.endTimeLabel")}</p>
            <DatePicker
              disabled={isSettingDate}
              customInputRef={""}
              showTimeSelect
              timeIntervals={1}
              dateFormat={"dd MMMM yyyy HH:mm"}
              customInput={
                <Input
                  placeholder={t("admin_player_ban_settings.assignLabel")}
                  className={cx(
                    "iso",
                    isInFuture(data.banStatus.bannedUntil)
                      ? c.active
                      : c.inactive,
                  )}
                />
              }
              selected={new Date(data.banStatus.bannedUntil)}
              onChange={setBanDate}
            />
            <Button small onClick={() => setBanDate(null)}>
              {t("admin_player_ban_settings.removeBanLabel")}
            </Button>
          </div>
          <br />
          <AdminRuleViolationContainer
            steamId={data.steamId}
            onUpdate={mutate}
          />
        </>
      ) : (
        <h2>{t("admin_player_ban_settings.loadingLabel")}</h2>
      )}
    </Panel>
  );
};
