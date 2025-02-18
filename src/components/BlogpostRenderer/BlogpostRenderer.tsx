import React from "react";
import { Noto_Sans } from "next/font/google";
import cx from "clsx";
import c from "./BlogpostRenderer.module.scss";
import { useEnrichedPostContent } from "@/components/BlogpostRenderer/post-enricher";

interface IBlogpostRendererProps {
  html: string;
}

const threadFont = Noto_Sans({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const BlogpostRenderer: React.FC<IBlogpostRendererProps> = ({
  html,
}) => {
  const preparedHtml = useEnrichedPostContent(html);
  return <div className={cx(threadFont.className, c.post)}>{preparedHtml}</div>;
};
