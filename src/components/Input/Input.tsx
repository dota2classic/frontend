import React from "react";

import c from "./Input.module.scss";
import cx from "classnames";

type IInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const Input: React.FC<IInputProps> = (props) => {
  return <input {...props} className={cx(c.input2, props.className)} />;
};
