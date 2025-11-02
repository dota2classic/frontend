import React, { useMemo } from "react";

interface SrcSetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageSizes?: number[]; // optional override
}

const defaultSizes = [1920, 1536, 1366, 1280, 768, 480];

export const SrcSetImage: React.FC<SrcSetImageProps> = React.memo(
  function SrcSetImage({ src, imageSizes = defaultSizes, ...rest }) {
    // Memoize srcSet
    const srcSet = useMemo(() => {
      return imageSizes
        .map((size) => {
          const parts = (src as string).split(".");
          const ext = parts.pop();
          const base = parts.join(".");
          return `${base}-${size}.${ext} ${size}w`;
        })
        .join(", ");
    }, [src, imageSizes]);

    // Memoize sizes attribute
    const sizesAttr = useMemo(() => {
      return imageSizes
        .slice()
        .sort((a, b) => a - b)
        .map((size) => `(max-width: ${size}px) ${size}px`)
        .join(", ");
    }, [imageSizes]);

    if (!src) return null;

    return <img alt="" {...rest} src={src} srcSet={srcSet} sizes={sizesAttr} />;
  },
);
