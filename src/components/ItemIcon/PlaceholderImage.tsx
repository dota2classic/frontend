import cx from "clsx";
import c from "./ItemIcon.module.scss";
import React from "react";

export const PlaceholderImage = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => (
  <span
    className={cx(c.img2)}
    style={{
      width: width,
      height: height,
    }}
  />
);
