import React from "react";
import cx from "clsx";
import c from "./PageHeader.module.scss";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  className,
  ...rest
}: PageHeaderProps) => (
  <div className={cx(c.header, className)} {...rest}>
    {breadcrumbs && <div className={c.breadcrumbs}>{breadcrumbs}</div>}
    {eyebrow && <span className={c.eyebrow}>{eyebrow}</span>}
    {title && (
      <div className={c.titleRow}>
        <h1 className={c.title}>{title}</h1>
      </div>
    )}
    {description && <p className={c.description}>{description}</p>}
    {actions && <div className={c.actions}>{actions}</div>}
  </div>
);
