import React from "react";

import c from "./AcceptCookiesContainer.module.scss";
import { useLocalStorage } from "react-use";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { FaCheck } from "react-icons/fa6";
import dynamic from "next/dynamic";
import { Trans, useTranslation } from "react-i18next";
import { AppRouter } from "@/route";
import { PageLink } from "@/components/PageLink";
import { Button } from "@/components/Button";

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
        <Trans
          i18nKey="accept_cookies.cookiesAgreement"
          values={{ site: "dotaclassic.ru" }}
          components={{
            pglink: (
              <PageLink className={"link"} link={AppRouter.contact.link} />
            ),
          }}
        ></Trans>
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
