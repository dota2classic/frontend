import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { visiblePoll } from "@/util/visible-poll";

export const useRefreshPageProps = () => {
  const router = useRouter();

  return useCallback(
    () =>
      router.replace(router.asPath, router.asPath, {
        scroll: false,
      }),
    [router],
  );
};

export const usePeriodicRefreshPageProps = (interval: number) => {
  const refresh = useRefreshPageProps();

  useEffect(
    () => visiblePoll(refresh, interval, { runOnStart: false }),
    [interval, refresh],
  );
};
