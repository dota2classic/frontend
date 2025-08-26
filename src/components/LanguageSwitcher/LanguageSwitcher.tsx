import React from "react";

import { NavbarItem } from "..";
import { useTranslation } from "react-i18next";
import c from "./LanguageSwitcher.module.scss";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lang: "en" | "ru") => {
    await i18n.changeLanguage(lang);
  };

  return (
    <NavbarItem
      className={c.languageSwitcher}
      action={() => {
        if (i18n.language === "ru") {
          return changeLanguage("en");
        } else {
          return changeLanguage("ru");
        }
      }}
    >
      {i18n.language === "en" ? (
        <img src="/flag/flag_en.png" alt="" />
      ) : (
        <img src="/flag/flag_ru.png" alt="" />
      )}
    </NavbarItem>
  );
};
