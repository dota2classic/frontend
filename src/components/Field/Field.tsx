import React, { PropsWithChildren, ReactNode } from "react";
import cx from "clsx";
import c from "./Field.module.scss";

type FieldProps = PropsWithChildren<{
  className?: string;
  hint?: ReactNode;
  label?: ReactNode;
  layout?: "vertical" | "horizontal";
}>;

export const Field: React.FC<FieldProps> = ({
  children,
  className,
  hint,
  label,
  layout = "vertical",
}) => {
  return (
    <div
      className={cx(
        c.field,
        layout === "horizontal" && c.layout__horizontal,
        className,
      )}
    >
      {(label || hint) && (
        <div className={c.header}>
          {label && <span className={c.label}>{label}</span>}
          {hint && <span className={c.hint}>{hint}</span>}
        </div>
      )}
      <div className={c.control}>{children}</div>
    </div>
  );
};
