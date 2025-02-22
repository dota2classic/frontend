import React from "react";

interface INumberFormatProps {
  number: number;
  comma?: boolean;
}

const FullNumberFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short", // Other option is 'long'
});

const CommaNumberFormat = new Intl.NumberFormat("en-US");

export const NumberFormat: React.FC<INumberFormatProps> = ({
  number,
  comma,
}) => {
  return (
    <>
      {number === 0
        ? "-"
        : (comma ? CommaNumberFormat : FullNumberFormat).format(number)}
    </>
  );
};
