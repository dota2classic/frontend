import { NodeRendererProps } from "@dota2classic/react-arborist";
import { RuleDto } from "@/api/back";
import React from "react";
import c from "./EditRulesContainer.module.scss";
import cx from "clsx";

export function RuleNode({
  node,
  style,
  dragHandle,
}: NodeRendererProps<RuleDto>) {
  const charLimit = 30;

  const displayTitle =
    node.data.description.length > charLimit
      ? node.data.description.slice(0, charLimit) + "..."
      : node.data.description;

  return (
    <div
      style={style}
      className={cx(c.node, node.isSelected && c.node__selected)}
      ref={dragHandle as unknown as React.LegacyRef<HTMLDivElement>}
    >
      <span className="gold">{node.data.index + 1}</span> {displayTitle}
    </div>
  );
}
