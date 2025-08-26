import React, { createElement, ReactNode } from "react";
import cx from "clsx";
import c from "@/containers/StoreLanding/StoreLanding.module.scss";
import { threadFont, TrajanPro } from "@/const/fonts";
import { Button } from "@/components";
import { useTranslation } from "react-i18next";

interface Props {
  image: string;
  title: ReactNode;
  text: ReactNode;
  light?: boolean;
  onPurchase?: () => void;
  heading: "h1" | "h2";
}

export const StoreLandingSlide: React.FC<Props> = ({
  image,
  title,
  heading,
  text,
  light,
  onPurchase,
}) => {
  const { t } = useTranslation();
  const headingElement = createElement(
    heading,
    {
      className: cx(TrajanPro.className, "megaheading"),
    },
    title,
  );
  return (
    <div className={cx(c.imageInfo)}>
      <div className={cx(c.imageWrapper, light && c.imageWrapper__light)}>
        <img src={image} alt="" />
      </div>
      {onPurchase && (
        <div className={c.payButton}>
          <Button onClick={onPurchase} className={cx(TrajanPro.className)} mega>
            {t("store_landing.subscribe")}
          </Button>
        </div>
      )}
      {headingElement}
      <p className={threadFont.className}>{text}</p>
    </div>
  );
};
