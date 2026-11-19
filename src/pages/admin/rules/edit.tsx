import { AdminRuleTabs } from "@/containers/AdminRuleTabs";
import { EditRulesContainer } from "@/containers/EditRulesContainer";
import { RuleDto, RulePunishmentDto } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";
import { getRequestApi } from "@/api/request-api";
import { NextPageContext } from "next";

interface Props {
  rules: RuleDto[];
  punishments: RulePunishmentDto[];
}

export default function EditRules({ rules, punishments }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <EmbedProps title={t("edit_rules.editingRules")} description={""} />
      <AdminRuleTabs />
      <EditRulesContainer rules={rules} punishments={punishments} />
    </>
  );
}

EditRules.getInitialProps = async (ctx: NextPageContext) => {
  const api = getRequestApi(ctx);
  return {
    rules: await api.rules.ruleControllerGetAllRules(),
    punishments: await api.rules.ruleControllerGetAllPunishments(),
  };
};
