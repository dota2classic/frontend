import React from "react";

import c from "./DevVersionIndicator.module.scss";

export const DevVersionIndicator: React.FC = () => {
  const doShow = process.env.NEXT_PUBLIC_IS_DEV_VERSION;
  if (!doShow) return null;
  return <div className={c.indicator}>DEV</div>;
};
