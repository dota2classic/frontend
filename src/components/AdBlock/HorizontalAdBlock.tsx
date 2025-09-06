import React from "react";

import c from "./AdBlock.module.scss";
import cx from "clsx";
import Image from "next/image";

interface Props {
  bannerId: string;
}

export const HorizontalAdBlock: React.FC<Props> = ({}: Props) => {
  return (
    <div className={c.horizontalAdBlock}>
      {/*<GenericAdBlock bannerId={bannerId} />*/}
      <a href="https://collectorsshop.ru/promo/old" target="__blank">
        <Image
          className={cx(c.imgHorizontal, c.imgHorizontal__large)}
          src="/img/D2C_Collectors_Wide_01.webp"
          alt=""
          priority
          unoptimized
          width={1179}
          height={120}
        />
        <Image
          className={cx(c.imgHorizontal, c.imgHorizontal__small)}
          src="/img/D2C_Collectors_Wide_02.webp"
          alt=""
          priority
          unoptimized
          width={414}
          height={120}
        />
      </a>
    </div>
  );
};
