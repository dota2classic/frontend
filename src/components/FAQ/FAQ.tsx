import React, { ReactNode, useState } from "react";

import c from "./FAQ.module.scss";
import cx from "classnames";
import { FaChevronDown } from "react-icons/fa";

interface FAQProp {
  title: ReactNode;
  content: ReactNode;
}
interface IFAQProps {
  items: FAQProp[];
}

const FAQEntry = ({ content, title }: FAQProp) => {
  const [open, setOpen] = useState(false);
  return (
    <details className={c.entry}>
      <summary onClick={() => setOpen((x) => !x)}>
        <span className={c.title}>{title}</span> <FaChevronDown />
      </summary>
      <div className={cx(c.entry__full, open && c.open)}>{content}</div>
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
