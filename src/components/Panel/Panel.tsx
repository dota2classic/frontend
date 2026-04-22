import React from "react";

import c from "./Panel.module.scss";
import cx from "clsx";
import { Surface } from "../Surface";

export const Panel = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) => {
  return (
    <Surface
      {...props}
      className={cx(props.className, c.panel)}
      padding="none"
      variant="panel"
    >
      {props.children}
    </Surface>
  );
};
