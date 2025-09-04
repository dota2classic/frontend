/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

import c from "./OnboardingTooltip.module.scss";

import { TooltipRenderProps } from "react-joyride";
import { threadFont, TrajanPro } from "@/const/fonts";
import cx from "clsx";
import { Button } from "../Button";
import { IoMdClose } from "react-icons/io";

export const OnboardingTooltip: React.FC<TooltipRenderProps> = (
  props: TooltipRenderProps,
) => {
  const {
    backProps,
    closeProps,
    continuous,
    index,
    primaryProps,
    step,
    tooltipProps,
  } = props;

  return (
    <div
      className={cx(
        c.tooltip,
        step.title && c.tooltip_title,
        threadFont.className,
      )}
      {...tooltipProps}
    >
      <IoMdClose
        className={cx(c.tooltip__close)}
        aria-label={closeProps["aria-label"]}
        onClick={closeProps.onClick as unknown as any}
        role={closeProps.role}
      />
      {step.title && (
        <h4 className={cx("tooltip__title", TrajanPro.className)}>
          {step.title}
        </h4>
      )}
      <div className={cx(c.tooltip__content)}>{step.content}</div>
      <div className={c.tooltip__footer}>
        <div className={c.tooltip__spacer}>
          {(index > 0 && (
            <Button
              small
              className={c.tooltip__button}
              onClick={backProps.onClick as unknown as any}
            >
              {backProps.title}
            </Button>
          )) || <div style={{ flex: 1 }} />}
          {continuous && (
            <Button
              small
              className={c.tooltip__button}
              onClick={primaryProps.onClick as unknown as any}
            >
              {primaryProps.title}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
