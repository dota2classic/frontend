import { appApi } from "@/api/hooks";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

export const getAuthUrl = () => `${appApi.apiParams.basePath}/v1/auth/steam`;

export const getTwitchConnectUrl = () =>
  `${appApi.apiParams.basePath}/v1/auth/twitch`;

export const useSniffReferral = () => {
  const router = useRouter();
  const ref = router.query["referral"];
  if (ref) {
    setCookie("d2c:referral", ref, {
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });
  }
};
