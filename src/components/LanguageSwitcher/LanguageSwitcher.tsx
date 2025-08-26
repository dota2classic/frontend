import React from "react";

import { NavbarItem } from "..";
import { useTranslation } from "react-i18next";
import c from "./LanguageSwitcher.module.scss";

function redirectToLocaleDomain(locale: "ru" | "en") {
  const currentUrl = window.location.href;

  // Redirect to the new URL
  window.location.href =
    locale === "en"
      ? currentUrl.replace(".ru", ".com")
      : currentUrl.replace(".com", ".ru");
}

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <NavbarItem
      className={c.languageSwitcher}
      action={() =>
        redirectToLocaleDomain(i18n.language === "ru" ? "en" : "ru")
      }
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
