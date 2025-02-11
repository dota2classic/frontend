import React from "react";

import {} from "..";

import c from "./MarkdownPost.module.scss";

interface IMarkdownPostProps {
  markdown: string;
}

export const MarkdownPost: React.FC<IMarkdownPostProps> = ({ markdown }) => {
  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};
