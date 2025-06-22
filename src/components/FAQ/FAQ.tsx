import React, { ReactNode } from "react";

import c from "./FAQ.module.scss";
import cx from "clsx";
import { FaChevronDown } from "react-icons/fa";

interface FAQProp {
  title: ReactNode;
  content: ReactNode;
}
interface IFAQProps {
  items: FAQProp[];
}

const FAQEntry = ({ content, title }: FAQProp) => {
  return (
    <details className={c.entry}>
      <summary>
        <span className={c.title}>{title}</span> <FaChevronDown />
      </summary>
      <div className={cx(c.entry__full)}>{content}</div>
    </details>
  );
};
export const FAQ: React.FC<IFAQProps> = ({ items }) => {
  return (
    <div className={c.faq}>
      {items.map((item, index) => (
        <FAQEntry key={index} {...item} />
      ))}
    </div>
  );
};
