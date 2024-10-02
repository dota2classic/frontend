import React, { PropsWithChildren } from "react";
import { NextLinkProp } from "@/route";
import c from './Breadcrumbs.module.scss'
interface Link {
  link: NextLinkProp;
}

interface IBreadcrumbsProps {}

export const Breadcrumbs: React.FC<PropsWithChildren<IBreadcrumbsProps>> = ({
  children,
}) => {
  const wrappedChildren = React.Children.toArray(children).map((child, index) => (
    <li key={index}>{child}</li>
  ));
  return <ol className={c.breadcrumbs}>{wrappedChildren}</ol>;
};
