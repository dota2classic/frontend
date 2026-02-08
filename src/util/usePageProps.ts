import { useRouter } from "next/router";
import { useEffect } from "react";

export const useRefreshPageProps = () => {
  const router = useRouter();

  return () =>
    router.replace(router.asPath, router.asPath, {
      scroll: false,
    });
};

export const usePeriodicRefreshPageProps = (interval: number) => {
  const refresh = useRefreshPageProps();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const timer = setInterval(async () => {
      await refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [interval, refresh]);
};
