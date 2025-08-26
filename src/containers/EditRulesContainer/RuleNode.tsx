import { NodeRendererProps } from "@dota2classic/react-arborist";
import { RuleDto } from "@/api/back";
import React from "react";
import c from "./EditRulesContainer.module.scss";
import cx from "clsx";
import { useTranslation } from "react-i18next";

export function RuleNode({
  node,
  style,
  dragHandle,
}: NodeRendererProps<RuleDto>) {
  const { t } = useTranslation();
  const charLimit = 30;

  const displayTitle =
    node.data.title.length > charLimit
      ? node.data.title.slice(0, charLimit) + "..."
      : node.data.title;

  const isMissingPunishment =
    node.data.children.length === 0 && !node.data.punishment;

  return (
    <div
      style={style}
      className={cx(
        c.node,
        node.isSelected && c.node__selected,
        isMissingPunishment && c.node__warning,
      )}
      ref={dragHandle as unknown as React.LegacyRef<HTMLDivElement>}
    >
      <span className="gold">{node.data.index + 1}</span>{" "}
      {t("rule_node.displayTitle", { title: displayTitle })}
    </div>
  );
}
