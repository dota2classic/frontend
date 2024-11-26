import React, { PropsWithChildren } from "react";
import { NextLinkProp } from "@/route";
import Link from "next/link";

interface IPageLinkProps {
  link: NextLinkProp;
  className?: string;
  onClick?: () => void;
}

export const PageLink: React.FC<PropsWithChildren<IPageLinkProps>> = (
  props,
) => {
  return (
    <Link
      className={props.className}
      href={props.link.href}
      as={props.link.as}
      passHref={props.link.passHref}
      shallow={props.link.shallow}
      scroll={true}
      onClick={props.onClick}
    >
      {props.children}
    </Link>
  );
};
