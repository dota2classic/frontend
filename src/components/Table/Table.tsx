import React from "react";

import {} from "..";

import c from "./Table.module.scss";
import cx from "classnames";

export const Table = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >,
) => {
  return (
    <table className={cx(c.table, props.className)}>{props.children}</table>
  );
};
