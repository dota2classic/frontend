import React from "react";
import { Logo } from "../Logo";
import c from "./BrandLogo.module.scss";
import cx from "clsx";

interface Props {
  size?: number;
  className?: string;
}

export const BrandLogo: React.FC<Props> = ({ size = 46, className }) => {
  return (
    <div className={cx(c.brand, className)}>
      <Logo size={size} />
      <span className={c.text}>
        <span className={c.word}>DOTA</span>
        <span className={cx(c.word, c.accent)}>Classic</span>
      </span>
    </div>
  );
};
