import React, { ReactNode } from "react";

import c from "./CoolList.module.scss";
import cx from "clsx";

interface ListItem {
  content: ReactNode;
  title: ReactNode;
}
interface ICoolListProps {
  items: ListItem[];
}

export const CoolList: React.FC<ICoolListProps> = ({ items }) => {
  return (
    <div className={c.list}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cx(c.step, index + 1 < items.length && c.next)}
        >
          <div className={c.step__num}>{index + 1}</div>
          <div className={c.step__content}>
            <h3>{item.title}</h3>
            <div className={c.content}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
