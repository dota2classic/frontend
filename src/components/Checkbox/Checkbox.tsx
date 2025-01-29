import React, { PropsWithChildren } from "react";

import c from "./Checkbox.module.scss";
import cx from "clsx";

interface ICheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<PropsWithChildren<ICheckboxProps>> = ({
  checked,
  disabled,
  onChange,
  className,
  children,
}) => {
  return (
    <label className={cx(c.container, disabled && c.disabled, className)}>
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={c.checkmark}></span>
      {children}
    </label>
  );
};
