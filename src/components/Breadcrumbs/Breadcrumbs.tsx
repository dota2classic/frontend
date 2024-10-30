import React, {PropsWithChildren} from "react";
import c from './Breadcrumbs.module.scss'


export const Breadcrumbs: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const wrappedChildren = React.Children.toArray(children).map((child, index) => (
    <li key={index}>{child}</li>
  ));
  return <ol className={c.breadcrumbs}>{wrappedChildren}</ol>;
};
