import React from "react";

import {} from "..";

import c from "./Section.module.scss";
import cx from "clsx";

export const Section = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLElement>,
    HTMLElement
  >,
) => {
  return (
    <section {...props} className={cx(props.className, c.section)}>
      {props.children}
    </section>
  );
};
