import React, { ReactNode } from "react";
import cx from "clsx";
import c from "@/containers/StoreLanding/StoreLanding.module.scss";
import { threadFont, TrajanPro } from "@/const/fonts";
import { Button } from "@/components";

interface Props {
  image: string;
  title: ReactNode;
  text: ReactNode;
  imageOffset?: string;
  light?: boolean;
  onPurchase?: () => void;
}

export const StoreLandingSlide: React.FC<Props> = ({
  image,
  title,
  text,
  imageOffset,
  light,
  onPurchase,
}) => {
  return (
    <div className={cx(c.imageInfo)}>
      <div className={cx(c.imageWrapper, light && c.imageWrapper__light)}>
        <img src={image} alt="" style={{ objectPosition: imageOffset }} />
      </div>
      {onPurchase && (
        <div className={c.payButton}>
          <Button onClick={onPurchase} className={cx(TrajanPro.className)} mega>
            Оформить подписку
          </Button>
        </div>
      )}
      <h2 className={cx(TrajanPro.className, "megaheading")}>{title}</h2>
      <p className={threadFont.className}>{text}</p>
    </div>
  );
};
