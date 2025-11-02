import React from "react";

interface SrcSetImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageSizes?: number[]; // optional override
}

const defaultSizes = [1920, 1536, 1366, 1280, 768, 480];

export const SrcSetImage: React.FC<SrcSetImageProps> = ({
  src,
  imageSizes = defaultSizes,
  ...rest
}) => {
  if (!src) return null;

  // generate srcSet based on sizes
  const srcSet = imageSizes
    .map((size) => {
      // insert size before file extension: example.jpg -> example-480.jpg
      const parts = (src as string).split(".");
      const ext = parts.pop();
      const base = parts.join(".");
      return `${base}-${size}.${ext} ${size}w`;
    })
    .join(", ");

  // generate sizes attribute for responsive layout
  const sizesAttr = imageSizes
    .slice()
    .sort((a, b) => a - b)
    .map((size) => `(max-width: ${size}px) ${size}px`)
    .join(", ");

  return <img alt="" {...rest} src={src} srcSet={srcSet} sizes={sizesAttr} />;
};
