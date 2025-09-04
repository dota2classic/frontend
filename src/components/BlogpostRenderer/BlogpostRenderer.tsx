import React from "react";
import cx from "clsx";
import c from "./BlogpostRenderer.module.scss";
import { useEnrichedPostContent } from "./post-enricher";
import { NotoSans } from "@/const/notosans";

interface IBlogpostRendererProps {
  html: string;
}

export const BlogpostRenderer: React.FC<IBlogpostRendererProps> = ({
  html,
}) => {
  const preparedHtml = useEnrichedPostContent(html);
  return <div className={cx(NotoSans.className, c.post)}>{preparedHtml}</div>;
};
