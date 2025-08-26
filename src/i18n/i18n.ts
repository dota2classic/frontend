import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_ru from "./ru.json";
import translation_en from "./en.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

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

const detector = new I18nextBrowserLanguageDetector();
detector.addDetector({
  name: "domainCustom",
  lookup() {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      return hostname.endsWith(".com") ? "en" : "ru";
    }
    return undefined;
  },
});

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "ru",
    detection: {
      // We will handle detection manually, so disable default detection
      order: ["domainCustom"],
      caches: [], // disable caching if needed
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
