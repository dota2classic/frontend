import React, { PropsWithChildren } from "react";

import c from "./Button.module.scss";
import cx from "clsx";
import { TrajanPro } from "@/const/fonts";
import { NextLinkProp } from "@/route";
import { PageLink } from "../PageLink";

export type ButtonVariant =
  | "default"
  | "mega"
  | "primary"
  | "ghost"
  | "landingPrimary";

export const Button: React.FC<
  PropsWithChildren<{
    link?: boolean;
    disabled?: boolean;
    href?: string;
    className?: string;
    onClick?: () => void;
    mega?: boolean;
    small?: boolean;
    large?: boolean;
    variant?: ButtonVariant;
    target?: string;
    pageLink?: NextLinkProp;
  }>
> = ({ className, link, mega, variant, small, large, pageLink, ...props }) => {
  const resolvedVariant = mega ? "mega" : variant;
  const cn = cx(
    c.button,
    resolvedVariant === "mega" && c.megaButton,
    resolvedVariant === "mega" && TrajanPro.className,
    small && c.smaller,
    large && c.larger,
    resolvedVariant === "primary" && c.primary,
    resolvedVariant === "ghost" && c.ghost,
    resolvedVariant === "landingPrimary" && c.landingPrimary,
    resolvedVariant === "landingPrimary" && large && c.landingPrimaryLg,
    className,
  );
  if (pageLink) {
    return (
      <PageLink className={cn} link={pageLink} onClick={props.onClick}>
        {props.children}
      </PageLink>
    );
  }
  if (link)
    return (
      <a className={cn} {...props}>
        {props.children}
      </a>
    );
  return (
    <button className={cn} {...props}>
      {/*{mega && (*/}
      {/*  <>*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*    <span className={cx(c.snow)} />*/}
      {/*  </>*/}
      {/*)}*/}
      {props.children}
    </button>
  );
};
