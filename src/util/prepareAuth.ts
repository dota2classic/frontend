import { setCookie } from "cookies-next";

export function prepareAuth() {
  setCookie("d2c:auth_redirect", window.location.href, {
    maxAge: 60 * 5 * 24 * 90, // 5 minutes
  });
}
