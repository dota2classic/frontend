import React, { PropsWithChildren } from "react";
import cx from "clsx";
import c from "./ActionChip.module.scss";

export type ActionChipVariant = "neutral" | "success" | "danger" | "warning";

type ActionChipProps = PropsWithChildren<{
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: ActionChipVariant;
}>;

export const ActionChip: React.FC<ActionChipProps> = ({
  active,
  className,
  variant = "neutral",
  ...props
}) => {
  return (
    <button
      {...props}
      className={cx(
        c.chip,
        c[`variant__${variant}`],
        active && c.active,
        className,
      )}
      type="button"
    >
      {props.children}
    </button>
  );
};
