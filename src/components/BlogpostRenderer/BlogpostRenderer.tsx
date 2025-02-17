import React from "react";
import { BlogpostDto } from "@/api/back";
import { Noto_Sans } from "next/font/google";
import cx from "clsx";
import c from "./BlogpostRenderer.module.scss";

interface IBlogpostRendererProps {
  post: BlogpostDto;
}

const threadFont = Noto_Sans({
  subsets: ["cyrillic", "cyrillic-ext", "latin-ext", "latin"],
});

export const BlogpostRenderer: React.FC<IBlogpostRendererProps> = ({
  post,
}) => {
  return (
    <div
      className={cx(threadFont.className, c.post)}
      dangerouslySetInnerHTML={{ __html: post.renderedContentHtml }}
    />
  );
};
