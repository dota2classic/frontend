import React, { ReactNode } from "react";
import cx from "clsx";
import c from "@/containers/NewQueuePage/NewQueuePage.module.scss";

export const QueuePageBlock = (
  p: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { heading?: ReactNode; icons?: ReactNode; simple?: boolean },
) => (
  <section className={cx(c.block, p.className, p.simple && c.block__simple)}>
    {(p.heading || p.icons) && (
      <header>
        <span className={c.block__header_title}>{p.heading}</span>
        <span className={c.block__icons}>{p.icons}</span>
      </header>
    )}
    <div className={c.block__content}>{p.children}</div>
  </section>
);
