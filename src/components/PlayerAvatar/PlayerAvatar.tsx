import React, { useState } from "react";

import Image from "next/image";

import type {
  OnLoadingComplete,
  PlaceholderValue,
} from "next/dist/shared/lib/get-img-props";
import c from "./PlayerAvatar.module.scss";
import { UserDTO } from "@/api/back";
import cx from "clsx";
import { hasSubscription } from "@/util/subscription";
import { PageLink } from "../PageLink/PageLink";
import { AppRouter, NextLinkProp } from "@/route";

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
  link?: NextLinkProp;
} & React.RefAttributes<HTMLImageElement | null>;

export const PlayerAvatar: React.FC<Props> = React.memo(function PlayerAvatar({
  user,
  link,
  ...props
}: Props) {
  const [error, setError] = useState<unknown>(null);
  const hat = hasSubscription(user) && user.hat?.image.url;
  const linkProp = link ?? AppRouter.players.player.index(user.steamId).link;

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
      <PageLink
        link={linkProp}
      >
        <Image
          {...props}
          className={cx(props.className, "avatar")}
          alt={props.alt || "Image"}
          src={error ? "/avatar.png" : user.avatar}
          onError={setError}
          title={user.name}
        />
      </PageLink>
    </picture>
  );
});
