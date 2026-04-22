import React from "react";

import c from "./Panel.module.scss";
import cx from "clsx";
import { Surface } from "../Surface";

// Legacy compatibility wrapper around Surface.
// Use Surface directly for new generic containers.
export const Panel = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
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
