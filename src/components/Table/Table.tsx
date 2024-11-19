import React from "react";

import c from "./Table.module.scss";
import cx from "clsx";
import { JetBrains_Mono } from "next/font/google";

const tableFont = JetBrains_Mono({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const Table = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >,
) => {
  return (
    <table className={cx(c.table, props.className, tableFont.className)}>
      {props.children}
    </table>
  );
};
