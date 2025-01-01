import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export const useRouterChanging = () => {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState<
    [boolean, string | undefined, boolean | undefined]
  >([false, "", false]);
  useEffect(() => {
    const handleRouteChange = (url: string, obj: { shallow: boolean }) => {
      setIsChanging([true, url, obj.shallow]);
    };

    const handleRouteChangeComplete = (
      url: string,
      obj: { shallow: boolean },
    ) => {
      setIsChanging([false, url, obj.shallow]);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
  return isChanging;
};
