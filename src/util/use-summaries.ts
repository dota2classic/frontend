import { useCallback, useEffect, useState } from "react";
import { PlayerSummaryDto } from "@/api/back";
import { getApi } from "@/api/hooks";

export const useSummaries = (users: string[]) => {
  const [summaries, setSummaries] = useState<Map<string, PlayerSummaryDto>>(
    () => new Map(),
  );
  const [loading, setLoading] = useState(false);

  const fetchMissing = useCallback(
    async (userIds: string[]) => {
      const existing = Array.from(summaries.keys());
      const newSteamIds = userIds.filter((id) => !existing.includes(id));
      if (newSteamIds.length === 0) return;

      setLoading(true);
      try {
        const results = await Promise.all(
          newSteamIds.map((id) =>
            getApi().playerApi.playerControllerPlayerSummary(id),
          ),
        );

        // Merge new summaries into the existing map
        setSummaries((prev) => {
          const updated = new Map(prev);
          results.forEach((result) => {
            updated.set(result.id, result);
          });
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [summaries],
  );

  useEffect(() => {
    if (users.length > 0) {
      fetchMissing(users);
    }
  }, [users, fetchMissing]);

  return { summaries, loading };
};
