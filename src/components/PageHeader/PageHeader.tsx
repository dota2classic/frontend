import React from "react";
import c from "./PageHeader.module.scss";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
}: PageHeaderProps) => (
  <div className={c.header}>
    {eyebrow && <span className={c.eyebrow}>{eyebrow}</span>}
    <h1 className={c.title}>{title}</h1>
    {description && <p className={c.description}>{description}</p>}
  </div>
);
