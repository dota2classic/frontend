import React from "react";
import type { TabItem } from "@/components/BigTabs";
import { BigTabs } from "@/components/BigTabs";
import { observer } from "mobx-react-lite";
import { AppRouter, NextLinkProp } from "@/route";
import { useRouter } from "next/router";
import { useStore } from "@/store";
import { MdLocalPolice } from "react-icons/md";
import { useTranslation } from "react-i18next";

type Keys = "forum" | "ticket" | "report" | "admin-ticket" | "admin-reports";

export const ForumTabs: React.FC = observer(() => {
  const router = useRouter();
  const { auth } = useStore();
  const { t } = useTranslation();

  const Items: TabItem<Keys>[] = [
    {
      key: "forum",
      label: t("forum_tabs.forum"),
      onSelect: AppRouter.forum.index().link,
    },
    {
      key: "ticket",
      label: t("forum_tabs.technicalSupport"),
      onSelect: AppRouter.forum.ticket.index().link,
    },
    {
      key: "report",
      label: t("forum_tabs.complaints"),
      onSelect: AppRouter.forum.report.index().link,
    },
    ...(auth.isModerator
      ? ([
          {
            key: "admin-ticket",
            label: (
              <>
                <MdLocalPolice />
                {t("forum_tabs.allTechnicalSupport")}
              </>
            ),
            onSelect: AppRouter.forum.ticket.admin().link,
          },
          {
            key: "admin-reports",
            label: (
              <>
                <MdLocalPolice />
                {t("forum_tabs.allComplaints")}
              </>
            ),
            onSelect: AppRouter.forum.report.admin().link,
          },
        ] satisfies TabItem<Keys>[])
      : []),
  ];

  const selected = Items.find((t) =>
    (t.onSelect as NextLinkProp).matches(router),
  )?.key;
  return (
    <BigTabs<Keys>
      flavor="small"
      items={Items}
      selected={selected || "forum"}
    />
  );
});
