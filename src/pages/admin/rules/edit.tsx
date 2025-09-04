import { AdminRuleTabs } from "@/containers/AdminRuleTabs";
import { EditRulesContainer } from "@/containers/EditRulesContainer";
import { getApi } from "@/api/hooks";
import { RuleDto, RulePunishmentDto } from "@/api/back";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

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

EditRules.getInitialProps = async () => {
  return {
    rules: await getApi().rules.ruleControllerGetAllRules(),
    punishments: await getApi().rules.ruleControllerGetAllPunishments(),
  };
};
