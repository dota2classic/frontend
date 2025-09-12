import React, { ReactNode } from "react";
import cx from "clsx";
import c from "@/containers/NewQueuePage/NewQueuePage.module.scss";

export const QueuePageBlock = (
  p: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { title?: ReactNode; icons?: ReactNode },
) => (
  <section className={cx(c.block, p.className)}>
    {(p.title || p.icons) && (
      <header>
        <span className={c.block__header_title}>{p.title}</span>
        <span className={c.block__icons}>{p.icons}</span>
      </header>
    )}
    <div className={c.block__content}>{p.children}</div>
  </section>
);
