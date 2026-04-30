import React from "react";
import cx from "clsx";
import { Surface } from "@/components/Surface";
import c from "./ActionCard.module.scss";

interface ActionCardProps
  extends Omit<React.ComponentProps<typeof Surface>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  metaClassName?: string;
  actionsClassName?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  className,
  title,
  description,
  actions,
  metaClassName,
  actionsClassName,
  children,
  padding = "md",
  variant = "raised",
  ...props
}) => {
  return (
    <Surface
      {...props}
      className={cx(c.card, className)}
      padding={padding}
      variant={variant}
    >
      <div className={c.content}>
        <div className={cx(c.meta, metaClassName)}>
          {title !== undefined && <span className={c.title}>{title}</span>}
          {description !== undefined && (
            <span className={c.description}>{description}</span>
          )}
          {children}
        </div>
        {actions !== undefined && (
          <div className={actionsClassName}>{actions}</div>
        )}
      </div>
    </Surface>
  );
};
