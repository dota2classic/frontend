import React, { PropsWithChildren, useEffect, useRef } from "react";

import c from "./AutoCarousel.module.scss";
import { Panel } from "@/components/Panel";
import cx from "clsx";

interface IAutoCarouselProps {
  className?: string;
  interval?: number;
  orientation?: "vertical" | "horizontal";
}

export const AutoCarousel: React.FC<PropsWithChildren<IAutoCarouselProps>> = ({
  className,
  children,
  interval = 10_000,
  orientation = "horizontal",
}) => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const slides = React.Children.toArray(children);
  const clones = [
    slides[slides.length - 1], // clone last
    ...slides,
    slides[0], // clone first
  ];

  const isVertical = orientation === "vertical";

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstChild = carousel.firstElementChild;
    if (!firstChild) return;

    const itemSize = isVertical
      ? (firstChild as HTMLElement).offsetHeight
      : (firstChild as HTMLElement).offsetWidth;

    // start on first real slide
    if (isVertical) {
      carousel.scrollTop = itemSize;
    } else {
      carousel.scrollLeft = itemSize;
    }

    const handleScroll = () => {
      // temporarily disable smooth scroll
      carousel.style.scrollBehavior = "auto";

      const scrollPos = isVertical ? carousel.scrollTop : carousel.scrollLeft;
      const maxScroll = itemSize * (clones.length - 1);

      if (scrollPos <= 0) {
        if (isVertical) carousel.scrollTop = itemSize * (clones.length - 2);
        else carousel.scrollLeft = itemSize * (clones.length - 2);
      } else if (scrollPos >= maxScroll) {
        if (isVertical) carousel.scrollTop = itemSize;
        else carousel.scrollLeft = itemSize;
      }

      requestAnimationFrame(() => {
        carousel.style.scrollBehavior = "smooth";
      });
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [clones.length, isVertical]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstChild = carousel.firstElementChild;
    if (!firstChild) return;

    const itemSize = isVertical
      ? (firstChild as HTMLElement).offsetHeight
      : (firstChild as HTMLElement).offsetWidth;

    const id = setInterval(() => {
      if (isVertical) {
        carousel.scrollBy({ top: itemSize, behavior: "smooth" });
      } else {
        carousel.scrollBy({ left: itemSize, behavior: "smooth" });
      }
    }, interval);

    return () => clearInterval(id);
  }, [interval, isVertical]);

  return (
    <Panel
      ref={carouselRef}
      className={cx(
        c.carousel,
        className,
        orientation === "vertical" && c.carousel__vertical,
      )}
    >
      {clones.map((child, idx) => (
        <div key={idx} className={c.carouselItem}>
          {child}
        </div>
      ))}
    </Panel>
  );
};
