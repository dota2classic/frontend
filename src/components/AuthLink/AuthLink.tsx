import React, { PropsWithChildren } from "react";
import { FaSteam } from "react-icons/fa";
import c from "./AuthLink.module.scss";
import cx from "clsx";
import { getAuthUrl } from "@/util/getAuthUrl";

export const AuthLink = ({ children }: PropsWithChildren) => {
  return (
    <a href={getAuthUrl()} className={cx(c.link, "link")}>
      <FaSteam style={{ marginRight: 4 }} />
      {children}
    </a>
  );
};
