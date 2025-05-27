import { EmbedProps } from "@/components";
import cx from "clsx";
import c from "@/pages/static/rules/RulesPage.module.scss";
import { NotoSans } from "@/const/notosans";
import { getApi } from "@/api/hooks";
import { RuleDto } from "@/api/back";
import { RuleRender } from "@/containers";

interface Props {
  rules: RuleDto[];
}

export default function NewRulesPage({ rules }: Props) {
  return (
    <>
      <EmbedProps
        title="Правила пользования сервисом"
        description="Правила, которые мы выставляем для поведения и игры на нашем проекте."
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
