"use client";
import React, { useEffect } from "react";
import { BrowserCookies } from "@/util/browser-cookies";
import { AUTH_TOKEN_COOKIE_KEY } from "@/const/cookie";
import Cookies from "js-cookie";
import { getBaseCookieDomain } from "@/util/getBaseCookieDomain";

const OLD_COOKIE_KEY = "d2c:auth_token_new"; // ← your old, invalid key

export const CookieChangedPopup: React.FC = () => {
  useEffect(() => {
    try {
      const domain = "." + getBaseCookieDomain();
      // Read the old cookie (js-cookie handles decoding safely)
      const oldValue =
        BrowserCookies.get(OLD_COOKIE_KEY) ||
        BrowserCookies.get(encodeURIComponent(OLD_COOKIE_KEY));

      if (oldValue && !BrowserCookies.get(AUTH_TOKEN_COOKIE_KEY)) {
        // Copy to new key with same attributes
        Cookies.set(AUTH_TOKEN_COOKIE_KEY, oldValue, {
          path: "/",
          sameSite: "none",
          secure: true,
          expires: 30,
          domain,
        });

        // Optionally, delete the old one to avoid confusion
        Cookies.remove(OLD_COOKIE_KEY, {
          path: "/",
          domain,
        });

        console.log(
          `Migrated cookie ${OLD_COOKIE_KEY} → ${AUTH_TOKEN_COOKIE_KEY}`,
        );
      } else {
        console.log("No old cookie!");
      }
    } catch (err) {
      console.error("Cookie migration failed:", err);
    }
  }, []);

  return null;
};
