import React from "react";
import { BigTabs } from "@/components";
import { AppRouter } from "@/route";
import { useRouter } from "next/router";

type RuleEnum = "rules" | "punishments";

export const AdminRuleTabs: React.FC = () => {
  const router = useRouter();

  return (
    <BigTabs<RuleEnum>
      items={[
        {
          key: "rules",
          label: "Правила",
          onSelect: AppRouter.admin.rules.editRules.link,
        },
        {
          key: "punishments",
          label: "Наказания",
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
