import { observer } from "mobx-react-lite";
import React from "react";
import { getApi } from "@/api/hooks";

interface Props {
  steamId: string;
}

export const LivePlayerMmr: React.FC<Props> = observer(({ steamId }) => {
  const { data, isLoading, error } =
    getApi().playerApi.usePlayerControllerPlayerSummary(steamId);
  if (isLoading) return;
  if (error) return <>Ошибка загрузки</>;
  return <>{data?.seasonStats.mmr}</>;
});
