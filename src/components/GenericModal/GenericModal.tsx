import React from "react";

import c from "./GenericModal.module.scss";
import cx from "classnames";

export const GenericModal = ({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => {
  return (
    <div {...props} className={cx(className, c.modalWrapper)}>
      {props.children}
    </div>
  );
};
