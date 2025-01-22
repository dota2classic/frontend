import React from "react";

import c from "./Checkbox.module.scss";
import cx from "clsx";

interface ICheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}

export const Checkbox: React.FC<ICheckboxProps> = ({
  checked,
  disabled,
  onChange,
}) => {
  return (
    <label className={cx(c.container, disabled && c.disabled)}>
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={c.checkmark}></span>
    </label>
  );
};
