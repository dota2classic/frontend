import React from "react";

import c from "./AdBlock.module.scss";
import cx from "clsx";

interface Props {
  bannerId: string;
}

export const HorizontalAdBlock: React.FC<Props> = ({}: Props) => {
  return (
    <div className={c.horizontalAdBlock}>
      {/*<GenericAdBlock bannerId={bannerId} />*/}
      <img
        className={cx(c.imgHorizontal, c.imgHorizontal__large)}
        src="/ads/D2C_Collectors_Wide_01.webp"
        loading="lazy"
        alt=""
      />
      <img
        className={cx(c.imgHorizontal, c.imgHorizontal__small)}
        src="/ads/D2C_Collectors_Wide_02.webp"
        loading="lazy"
        alt=""
      />
    </div>
  );
};
