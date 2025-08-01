import React, { PropsWithChildren } from "react";

import c from "./Form.module.scss";
import { NotoSans } from "@/const/notosans";
import cx from "clsx";
import { Panel } from "@/components";

export const Form: React.FC<PropsWithChildren> = ({ children }) => {
  return <Panel className={cx(c.form, NotoSans.className)}>{children}</Panel>;
};
