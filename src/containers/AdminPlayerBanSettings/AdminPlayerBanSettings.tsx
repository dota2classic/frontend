import React from "react";

import c from "./AdminPlayerBanSettings.module.scss";
import { TimeAgo } from "@/components";
import { getApi } from "@/api/hooks";
import { AdminRuleViolationContainer } from "@/containers";

interface IAdminPlayerBanSettingsProps {
  steamId: string;
}

export const AdminPlayerBanSettings: React.FC<IAdminPlayerBanSettingsProps> = ({
  steamId,
}) => {
  const { data, mutate } =
    getApi().adminApi.useAdminUserControllerBanOf(steamId);

  return (
    <div className={c.container}>
      {data ? (
        <>
          <p>
            Время окончания:{" "}
            <span className="gold">
              <TimeAgo date={data.banStatus.bannedUntil} />
            </span>
          </p>
          <AdminRuleViolationContainer
            steamId={data.steamId}
            onUpdate={mutate}
          />
        </>
      ) : (
        <h2>Загрузка</h2>
      )}
    </div>
  );
};
