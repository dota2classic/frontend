import React from "react";

import c from "./AcceptCookiesContainer.module.scss";
import { useLocalStorage } from "react-use";
import { Button, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { FaCheck } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

function AcceptCookiesContainerAll() {
  const { t } = useTranslation();
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    "d2c:cookies_accepted",
    false,
  );

  if (cookiesAccepted) return null;

  return (
    <div className={cx(c.cookies, threadFont.className)}>
      <p>
        {t("accept_cookies.cookiesAgreement", { site: "dotaclassic.ru" })}
        {t("accept_cookies.readMore")}
        <PageLink className={"link"} link={AppRouter.contact.link}>
          {t("accept_cookies.here")}
        </PageLink>
        .
      </p>

      <Button small onClick={() => setCookiesAccepted(true)}>
        <FaCheck />
        {t("accept_cookies.agree")}
      </Button>
    </div>
  );
}

export const AcceptCookiesContainer = dynamic<React.FC>(
  () => Promise.resolve(AcceptCookiesContainerAll),
  {
    ssr: false,
  },
) as React.FC;
