import { RuleDto } from "@/api/back";
import { RuleRender } from "@/containers/RuleRender";
import { useTranslation } from "react-i18next";
import { StaticPageShell } from "@/components/StaticPageShell";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface Props {
  rules: RuleDto[];
}

export default function NewRulesPage({ rules }: Props) {
  const { t } = useTranslation();

  return (
    <StaticPageShell
      eyebrow="Rules"
      title={t("rules_page.seo.title")}
      description={t("rules_page.seo.description")}
      embedTitle={t("rules_page.seo.title")}
      embedDescription={t("rules_page.seo.description")}
    >
      {rules.map((rule) => (
        <RuleRender key={rule.id} rule={rule} />
      ))}
    </StaticPageShell>
  );
}

NewRulesPage.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  return {
    rules: await api.rules.ruleControllerGetAllRules(),
  };
};
