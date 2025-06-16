import React from "react";

import c from "./DevVersionIndicator.module.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import { getApi } from "@/api/hooks";
import { NotoSans } from "@/const/notosans";

export const DevVersionIndicator: React.FC = observer(() => {
  const { auth } = useStore();
  const doShow = process.env.NEXT_PUBLIC_IS_DEV_VERSION;
  const { data, error } = getApi().statsApi.useStatsControllerMaintenance();
  const isMaintenance = (data?.active || error) && !auth.isAdmin;

  if (isMaintenance) {
    return (
      <div className={c.maintenance}>
        <h1 className="megaheading">Сайт обновляется</h1>
        <p className={NotoSans.className}>
          Можешь пока посмотреть на этих добряков, а сайт откроется, как только
          он обновится.
        </p>
        <img src="/splash/kek.webp" alt="" />
      </div>
    );
  }

  if (!doShow) return null;

  return <div className={c.indicator}>DEV</div>;
});
