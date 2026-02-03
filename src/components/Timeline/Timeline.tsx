import React, { ReactNode } from "react";

import c from "./Timeline.module.scss";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";
import i18next from "i18next";

interface ListItem {
  content: ReactNode;
  title: ReactNode;
  time: Date;
}
interface ICoolListProps {
  items: ListItem[];
  className?: string;
}

function getPrettyMonth(
  date: Date,
  locale: string = navigator.language,
  format: "long" | "short" | "narrow" = "long",
): string {
  return new Intl.DateTimeFormat(locale, {
    month: format,
  }).format(date);
}

function formatWeekdayTime(
  date: Date,
  locale: string = i18next.language,
  hour12: boolean = false,
): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    date,
  );
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12,
  }).format(date);

  return `${weekday} ${time}`;
}

export const Timeline: React.FC<ICoolListProps> = ({ items, className }) => {
  return (
    <div className={cx(c.list, className)}>
      {items.map((item, index) => {
        const month = getPrettyMonth(item.time, i18next.language);

        return (
          <div
            key={index}
            className={cx(c.step, index + 1 < items.length && c.next)}
          >
            <div className={c.step__num}>
              <div className={c.month}>{month.substring(0, 3)}</div>
              <div className={c.date}>
                {item.time.getDate().toString().padStart(2, "0")}
              </div>
            </div>
            <div className={c.step__content}>
              <span className={c.time}>{formatWeekdayTime(item.time)}</span>
              <div className={c.title}>{item.title}</div>
              <div className={cx(c.content, NotoSans.className)}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
