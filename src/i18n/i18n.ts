import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_ru from "./ru.json";
import translation_en from "./en.json";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ru: {
    translation: translation_ru,
  },
  en: {
    translation: translation_en,
  },
};
i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
    fallbackLng: "ru",

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
