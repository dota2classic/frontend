import React from "react";

import c from "./Table.module.scss";
import cx from "clsx";
import { tableFont } from "@/const/fonts";

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
