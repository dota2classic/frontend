import React from "react";
import { BigTabs } from "@/components/BigTabs";
import { AppRouter } from "@/route";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type RuleEnum = "rules" | "punishments";

export const AdminRuleTabs: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <BigTabs<RuleEnum>
      items={[
        {
          key: "rules",
          label: t("admin_rule_tabs.rules"),
          onSelect: AppRouter.admin.rules.editRules.link,
        },
        {
          key: "punishments",
          label: t("admin_rule_tabs.punishments"),
          onSelect: AppRouter.admin.rules.editPunishments.link,
        },
      ]}
      selected={
        router.pathname.endsWith("punishments") ? "punishments" : "rules"
      }
      flavor={"small"}
    />
  );
};
