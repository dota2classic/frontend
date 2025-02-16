import React, { CSSProperties, PropsWithChildren } from "react";
import { NextLinkProp } from "@/route";
import Link from "next/link";

interface IPageLinkProps {
  link: NextLinkProp;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  testId?: string;
  style?: CSSProperties;
}

export const PageLink: React.FC<PropsWithChildren<IPageLinkProps>> = React.memo(
  function PageLink(props) {
    return (
      <Link
        style={props.style}
        className={props.className}
        href={props.link.href}
        as={props.link.as}
        passHref={props.link.passHref}
        shallow={props.link.shallow}
        scroll={true}
        onClick={props.onClick}
        data-testid={props.testId}
      >
        {props.children}
      </Link>
    );
  },
);
