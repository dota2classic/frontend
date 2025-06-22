import React from "react";
import { BigTabs } from "@/components";
import { AppRouter, NextLinkProp } from "@/route";
import { useRouter } from "next/router";
import { TabItem } from "@/components/BigTabs/BigTabs";
import { TrajanPro } from "@/const/fonts";

type TechTab = "performance" | "commands" | "faq" | "download";

const items: TabItem<TechTab>[] = [
  {
    key: "download",
    onSelect: AppRouter.download.link,
    label: "Быстрый старт",
  },
  {
    key: "performance",
    onSelect: AppRouter.static.tech.performance.link,
    label: "Повысить FPS",
  },
  {
    key: "commands",
    onSelect: AppRouter.static.tech.commands.link,
    label: "Настройка клиента",
  },
  {
    key: "faq",
    onSelect: AppRouter.static.tech.faq.link,
    label: "Частые проблемы",
  },
];

export const TechStaticTabs: React.FC = ({}) => {
  const router = useRouter();
  const selected = items.find((t) =>
    (t.onSelect as NextLinkProp).matches(router),
  )?.key;

  return (
    <BigTabs<TechTab>
      items={items}
      className={TrajanPro.className}
      selected={selected || "performance"}
      flavor="small"
    />
  );
};
