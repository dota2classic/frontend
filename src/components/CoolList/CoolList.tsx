import React, { ReactNode } from "react";

import c from "./CoolList.module.scss";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";

interface ListItem {
  content: ReactNode;
  title: ReactNode;
  time?: ReactNode;
}
interface ICoolListProps {
  items: ListItem[];
  className?: string;
}

export const CoolList: React.FC<ICoolListProps> = ({ items, className }) => {
  return (
    <div className={cx(c.list, className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cx(c.step, index + 1 < items.length && c.next)}
        >
          <div className={c.step__num}>{index + 1}</div>
          <div className={c.step__content}>
            {item.time && <span>{item.time}</span>}
            <h3>{item.title}</h3>
            <div className={cx(c.content, NotoSans.className)}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
