import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return <h1>{t("not_found.pageNotFound")}</h1>;
}
