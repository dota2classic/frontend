import React from "react";

import { NavbarItem } from "..";
import { useTranslation } from "react-i18next";
import c from "./LanguageSwitcher.module.scss";

function redirectToLocaleDomain(locale: "ru" | "en") {
  const currentUrl = window.location.href;
  const hostname = window.location.hostname;

  if (locale === "en" && !hostname.startsWith("en.")) {
    // we want prepend en to domain
    window.location.href = currentUrl.replace(hostname, `en.${hostname}`);
  } else if (locale === "ru" && hostname.startsWith("en.")) {
    window.location.href = currentUrl.replace(`en.`, "");
  }
}

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <NavbarItem
      className={c.languageSwitcher}
      action={() => {}}
      options={[
        i18n.language === "en"
          ? {
              action: () => redirectToLocaleDomain("ru"),
              label: <img src="/flag/flag_ru.png" alt="" />,
            }
          : {
              action: () => redirectToLocaleDomain("en"),
              label: <img src="/flag/flag_en.png" alt="" />,
            },
      ]}
    >
      {i18n.language === "en" ? (
        <img src="/flag/flag_en.png" alt="" />
      ) : (
        <img src="/flag/flag_ru.png" alt="" />
      )}
    </NavbarItem>
  );
};
