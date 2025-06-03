import React from "react";

interface Props {
  size?: number;
}
export const Logo: React.FC<Props> = ({ size }) => {
  return <img src="/logo/128.png" width={size || 46} height={size || 46} />;
};
