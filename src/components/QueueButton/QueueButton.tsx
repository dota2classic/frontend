import React from "react";

import c from "./QueueButton.module.scss";
import cx from "clsx";

export const QueueButton: React.FC<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...props }) => {
  return (
    <button {...props} className={cx(c.button, className)}>
      {children}
    </button>
  );
};
