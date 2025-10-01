import { getBaseCookieDomain } from "@/util/getBaseCookieDomain";

export function eraseCookie(name: string) {
  if (typeof window !== "undefined") {
    const eraseDomain = "." + getBaseCookieDomain();
    document.cookie =
      name + "=; Max-Age=0; path=/; domain=" + eraseDomain + ";";

    document.cookie =
      encodeURIComponent(name) +
      "=; Max-Age=0; path=/; domain=" +
      eraseDomain +
      ";";
  }
}
