import React, { useState } from "react";

import Image from "next/image";

import type {
  OnLoadingComplete,
  PlaceholderValue,
} from "next/dist/shared/lib/get-img-props";
import c from "./PlayerAvatar.module.scss";
import { UserDTO } from "@/api/back";
import cx from "clsx";

type Props = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"
> & {
  user: UserDTO;
  alt: string;
  width: number;
  height: number;
  fill?: boolean | undefined;
  quality?: number | `${number}` | undefined;
  priority?: boolean | undefined;
  loading?: "eager" | "lazy" | undefined;
  placeholder?: PlaceholderValue | undefined;
  blurDataURL?: string | undefined;
  unoptimized?: boolean | undefined;
  overrideSrc?: string | undefined;
  onLoadingComplete?: OnLoadingComplete | undefined;
  layout?: string | undefined;
  objectFit?: string | undefined;
  objectPosition?: string | undefined;
  lazyBoundary?: string | undefined;
  lazyRoot?: string | undefined;
} & React.RefAttributes<HTMLImageElement | null>;

export const PlayerAvatar: React.FC<Props> = React.memo(function PlayerAvatar({
  user,
  ...props
}: Props) {
  const [error, setError] = useState<unknown>(null);
  const hat = user.hat?.image.url;

  return (
    <picture className={c.avatar}>
      {hat && (
        <Image
          alt=""
          width={props.width}
          height={props.width * 1.55}
          className={c.hat}
          src={hat}
        />
      )}
      <Image
        {...props}
        className={cx(props.className, "avatar")}
        alt={props.alt || "Image"}
        src={error ? "/avatar.png" : user.avatar}
        onError={(err) => {
          console.error("ERROR loading src", err);
          setError(err);
        }}
      />
    </picture>
  );
});
