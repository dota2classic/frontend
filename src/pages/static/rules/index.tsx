import { EmbedProps } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { getApi } from "@/api/hooks";
import { RuleDto } from "@/api/back";
import { RuleRender } from "@/containers";
import { useTranslation } from "react-i18next";

interface Props {
  rules: RuleDto[];
}

export default function NewRulesPage({ rules }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps
        title={t("rules_page.usageRules")}
        description={t("rules_page.rulesDescription")}
      />
      <div className={cx(c.postContainer, NotoSans.className)}>
        {rules.map((rule) => (
          <RuleRender key={rule.id} rule={rule} />
        ))}
      </div>
    </>
  );
}

NewRulesPage.getInitialProps = async () => {
  return {
    rules: await getApi().rules.ruleControllerGetAllRules(),
  };
};
