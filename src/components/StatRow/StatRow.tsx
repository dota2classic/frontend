import React, { ReactNode } from "react";
import cx from "clsx";
import c from "./StatRow.module.scss";
import { Tooltipable } from "../Tooltipable";

interface StatRowProps {
  className?: string;
  label: ReactNode;
  testId?: string;
  tooltip?: ReactNode;
  value: ReactNode;
  valueClassName?: string;
}

export const StatRow: React.FC<StatRowProps> = ({
  className,
  label,
  testId,
  tooltip,
  value,
  valueClassName,
}) => {
  const valueNode = <dd className={cx(c.value, valueClassName)}>{value}</dd>;

  return (
    <dl className={cx(c.row, className)} data-testid={testId}>
      {tooltip ? (
        <Tooltipable tooltip={tooltip}>{valueNode}</Tooltipable>
      ) : (
        valueNode
      )}
      <dt className={c.label}>{label}</dt>
    </dl>
  );
};
