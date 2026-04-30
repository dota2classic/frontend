import React, { ReactNode } from "react";
import cx from "clsx";
import c from "./EmptyState.module.scss";

type EmptyStateProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "◎",
  actions,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cx(c.state, className)}>
      {icon ? <span className={c.icon}>{icon}</span> : null}
      <h3 className={c.title}>{title}</h3>
      {description ? <p className={c.description}>{description}</p> : null}
      {actions ? <div className={c.actions}>{actions}</div> : null}
    </div>
  );
};
