import React, { PropsWithChildren } from "react";
import cx from "classnames";
import c from "./Typography.module.scss";
interface TypographyProps {
  radiant?: boolean;
  dire?: boolean;
}

const Header = ({
  children,
  radiant,
  dire,
}: PropsWithChildren<TypographyProps>) => (
  <header
    className={cx(c.header, {
      [c.radiant]: radiant,
      [c.dire]: dire,
    })}
  >
    {children}
  </header>
);

export const Typography = {
  Header,
};
