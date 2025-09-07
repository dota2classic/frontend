import React from "react";
import { getApi } from "@/api/hooks";

interface Props {
  steamId: string;
}

export const LivePlayerMmr: React.FC<Props> = React.memo(
  function LivePlayerMmr({ steamId }) {
    const { data, isLoading, error } =
      getApi().playerApi.usePlayerControllerPlayerSummary(steamId, {
        revalidateOnMount: false,
        dedupingInterval: 60_000,
      });
    if (isLoading) return;
    if (error) return <>Ошибка загрузки</>;
    return <>{data?.seasonStats.mmr}</>;
  },
);
