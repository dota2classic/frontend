import React from "react";

import c from "./TableRowLoading.module.scss";

interface Props {
  columns: number;
  rows: number;
}
export const TableRowLoading = ({ columns, rows }: Props) => {
  const arr1 = new Array(rows).fill(null);
  const arr2 = new Array(columns).fill(null);
  return (
    <>
      {arr1.map((_, row) => (
        <tr key={row} className={c.loading}>
          {arr2.map((_, col) => (
            <td key={col}></td>
          ))}
        </tr>
      ))}
    </>
  );
};
