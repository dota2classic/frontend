import React from "react";

import c from "./Panel.module.scss";
import cx from "classnames";

export const Panel = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) => {
  return (
    <div {...props} className={cx(props.className, c.panel)}>
      {props.children}
    </div>
  );
};
