import React, { PropsWithChildren } from "react";

import c from "./Form.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { Surface } from "@/components/Surface";

export const Form: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Surface
      className={cx(c.form, NotoSans.className)}
      padding="xs"
      variant="panel"
    >
      {children}
    </Surface>
  );
};
