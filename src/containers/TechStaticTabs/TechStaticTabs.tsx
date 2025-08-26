import React from "react";
import { BigTabs } from "@/components";
import { AppRouter, NextLinkProp } from "@/route";
import { useRouter } from "next/router";
import { TabItem } from "@/components/BigTabs/BigTabs";
import { TrajanPro } from "@/const/fonts";
import { useTranslation } from "react-i18next";

type TechTab = "performance" | "commands" | "faq" | "download";

const items: TabItem<TechTab, string>[] = [
  {
    key: "download",
    onSelect: AppRouter.download.link,
    label: "tech_static_tabs.quickStart",
  },
  {
    key: "performance",
    onSelect: AppRouter.static.tech.performance.link,
    label: "tech_static_tabs.increaseFPS",
  },
  {
    key: "commands",
    onSelect: AppRouter.static.tech.commands.link,
    label: "tech_static_tabs.clientSetup",
  },
  {
    key: "faq",
    onSelect: AppRouter.static.tech.faq.link,
    label: "tech_static_tabs.frequentIssues",
  },
];

export const TechStaticTabs: React.FC = ({}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const selected = items.find((t) =>
    (t.onSelect as NextLinkProp).matches(router),
  )?.key;

  return (
    <BigTabs<TechTab>
      items={items.map((item) => ({
        ...item,
        label: t(item.label),
      }))}
      className={TrajanPro.className}
      selected={selected || "performance"}
      flavor="small"
    />
  );
};
