import Cookies from "js-cookie";

export const BrowserCookies = {
  get(key: string): string | undefined {
    return (Cookies as { get(key: string): string | undefined }).get(key);
  },
};
