import React, { ReactNode } from "react";

import c from "./InfoCardWithIcon.module.scss";
import { threadFont } from "@/const/fonts";
import cx from "clsx";

interface IInfoCardWithIconProps {
  icon: ReactNode;
  title: ReactNode;
  text: ReactNode;
}

export const InfoCardWithIcon: React.FC<IInfoCardWithIconProps> = ({
  icon,
  title,
  text,
}) => {
  return (
    <div className={cx(c.card, threadFont.className)}>
      <span className={c.icon}>{icon}</span>
      <span className={c.title}>{title}</span>
      <span className={c.text}>{text}</span>
    </div>
  );
};
