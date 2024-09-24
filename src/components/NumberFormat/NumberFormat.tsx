import React from "react";

interface INumberFormatProps {
  number: number;
}

export const NumberFormat: React.FC<INumberFormatProps> = ({ number }) => {
  return (
    <>
      {number === 0
        ? "-"
        : new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short", // Other option is 'long'
          }).format(number)}
    </>
  );
};
