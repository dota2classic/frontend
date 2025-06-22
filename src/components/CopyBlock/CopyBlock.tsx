import React from "react";

import { CopySomething, Input } from "..";

interface ICopyBlockProps {
  text: string;
  command: string;
}

export const CopyBlock = (p: ICopyBlockProps) => {
  return (
    <>
      <p>{p.text}</p>
      <CopySomething
        something={p.command}
        placeholder={<Input value={p.command} readOnly={true} />}
      />
    </>
  );
};
