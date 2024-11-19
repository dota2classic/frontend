import React, { PropsWithChildren } from "react";
import { appApi } from "@/api/hooks";
import { FaSteam } from "react-icons/fa";
import c from "./AuthLink.module.scss";
import cx from "clsx";
export const AuthLink = ({ children }: PropsWithChildren) => {
  return (
    <a
      href={`${appApi.apiParams.basePath}/v1/auth/steam`}
      className={cx(c.link, "link")}
    >
      <FaSteam style={{ marginRight: 4 }} />
      {children}
    </a>
  );
};
