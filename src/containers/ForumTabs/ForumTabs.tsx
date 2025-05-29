import React from "react";
import { BigTabs } from "@/components";
import { observer } from "mobx-react-lite";
import { AppRouter, NextLinkProp } from "@/route";
import { useRouter } from "next/router";
import { TabItem } from "@/components/BigTabs/BigTabs";
import { useStore } from "@/store";
import { MdLocalPolice } from "react-icons/md";

type Keys = "forum" | "ticket" | "report" | "admin-ticket" | "admin-reports";

export const ForumTabs: React.FC = observer(() => {
  const router = useRouter();
  const { auth } = useStore();

  const Items: TabItem<Keys>[] = [
    {
      key: "forum",
      label: "Форум",
      onSelect: AppRouter.forum.index().link,
    },
    {
      key: "ticket",
      label: "Техподдержка",
      onSelect: AppRouter.forum.ticket.index().link,
    },
    {
      key: "report",
      label: "Жалобы",
      onSelect: AppRouter.forum.report.index().link,
    },
    ...(auth.isModerator
      ? ([
          {
            key: "admin-ticket",
            label: (
              <>
                <MdLocalPolice />
                Вся теххподдержка
              </>
            ),
            onSelect: AppRouter.forum.ticket.admin().link,
          },
          {
            key: "admin-reports",
            label: (
              <>
                <MdLocalPolice />
                Все жалобы
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
