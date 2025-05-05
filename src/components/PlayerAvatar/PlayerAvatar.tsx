import React, { useState } from "react";

import Image from "next/image";

import type {
  OnLoadingComplete,
  PlaceholderValue,
} from "next/dist/shared/lib/get-img-props";
import c from "./PlayerAvatar.module.scss";
import { UserDTO } from "@/api/back";

type Props = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  "height" | "width" | "loading" | "ref" | "alt" | "src" | "srcSet"
> & {
  user: UserDTO;
  alt: string;
  width?: number | `${number}` | undefined;
  height?: number | `${number}` | undefined;
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
  const hat =
    "https://s3.dotaclassic.ru/public/upload/7aa65613d616dc1ffe31e6e3fed924b25b6aabc5222493841466f2909b498314.webp";

  return (
    <picture className={c.avatar}>
      <Image
        alt=""
        width={props.width}
        height={props.height}
        className={c.hat}
        src={hat}
      />
      <Image
        {...props}
        alt={props.alt || "Image"}
        src={error ? "/avatar.png" : user.avatar}
        onError={setError}
      />
    </picture>
  );
});
