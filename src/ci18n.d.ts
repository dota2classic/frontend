/* eslint-disable @typescript-eslint/no-explicit-any */
// i18next-custom.d.ts
import "react-i18next";
import { TranslationKey } from "@/TranslationKey";

declare module "react-i18next" {
  // Define your custom keys
  // type MyTranslationKeys = keyof TranslationTypes;

  export type TranslationFunction = (
    key: TranslationKey,
    options?: any,
  ) => string;

  // Override the useTranslation hook
  function useTranslation(): {
    t: TranslationFunction;
    i18n: any; // or import the proper type if available
  };
}
