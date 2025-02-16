import type { PropsWithChildren } from "react";
import * as React from "react";
import cx from "clsx";
import c from "../PlayerMentionPlugin/Mention.module.scss";

type Props = PropsWithChildren<{
  index: number;
  key: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}>;

export const MentionSelectionListItem: React.FC<Props> = ({
  index,
  isSelected,
  key,
  onClick,
  onMouseEnter,
  children,
}) => (
  <li
    key={key}
    tabIndex={-1}
    className={cx(c.item, isSelected && c.selected)}
    role="option"
    aria-selected={isSelected}
    id={"typeahead-item-" + index}
    onMouseEnter={onMouseEnter}
    onClick={onClick}
  >
    {children}
  </li>
);
