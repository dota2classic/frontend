import React from "react";

import c from "./PostContainer.module.scss";
import cx from "clsx";
import { NotoSans } from "@/const/notosans";

type IPostContainerProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {};

export const PostContainer: React.FC<IPostContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cx(c.postContainer, NotoSans.className, className)}
      {...props}
    >
      {children}
    </div>
  );
};
