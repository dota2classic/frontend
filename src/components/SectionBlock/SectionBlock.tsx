import React, { ReactNode } from "react";
import cx from "clsx";
import c from "./SectionBlock.module.scss";

type SectionBlockProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  title?: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "simple";
};

export const SectionBlock: React.FC<SectionBlockProps> = ({
  title,
  actions,
  variant = "default",
  className,
  children,
  ...props
}) => {
  return (
    <section
      {...props}
      className={cx(
        c.block,
        variant === "simple" && c.variant__simple,
        className,
      )}
    >
      {(title || actions) && (
        <header className={c.header}>
          <span className={c.title}>{title}</span>
          <span className={c.actions}>{actions}</span>
        </header>
      )}
      <div className={c.content}>{children}</div>
    </section>
  );
};
