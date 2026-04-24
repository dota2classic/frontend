import { EmbedProps } from "@/components/EmbedProps";
import { Surface } from "@/components/Surface";
import { TrajanPro, threadFont } from "@/const/fonts";
import cx from "clsx";
import React from "react";
import c from "./StaticPageShell.module.scss";

interface StaticPageShellProps {
  title: React.ReactNode;
  embedTitle: string;
  embedDescription: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  tabs?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const StaticPageShell: React.FC<StaticPageShellProps> = ({
  title,
  embedTitle,
  embedDescription,
  description,
  eyebrow,
  tabs,
  actions,
  children,
  className,
  contentClassName,
}) => {
  return (
    <>
      <EmbedProps title={embedTitle} description={embedDescription} />
      <main className={c.page}>
        <div className={cx(c.shell, threadFont.className, className)}>
          <Surface padding="lg" variant="surface">
            <div className={c.hero}>
              {eyebrow && <span className={c.eyebrow}>{eyebrow}</span>}
              <h1 className={cx(c.title, TrajanPro.className)}>{title}</h1>
              {description && <p className={c.description}>{description}</p>}
              {(tabs || actions) && (
                <div className={c.tabs}>
                  {tabs}
                  {actions}
                </div>
              )}
            </div>
          </Surface>
          <div className={cx(c.body, c.content, contentClassName)}>
            {children}
          </div>
        </div>
      </main>
    </>
  );
};
