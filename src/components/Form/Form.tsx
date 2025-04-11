import React from "react";

import { Panel } from "..";

import c from "./Form.module.scss";
import cx from "clsx";

type IFormProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Form: React.FC<IFormProps> = ({
  className,
  children,
  ...props
}: IFormProps) => {
  return (
    <Panel className={cx(c.form, className)} {...props}>
      {children}
    </Panel>
  );
};
