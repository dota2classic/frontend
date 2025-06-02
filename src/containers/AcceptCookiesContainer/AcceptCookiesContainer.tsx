import React from "react";

import c from "./AcceptCookiesContainer.module.scss";
import { useLocalStorage } from "react-use";
import { Button, PageLink } from "@/components";
import { AppRouter } from "@/route";
import cx from "clsx";
import { threadFont } from "@/const/fonts";
import { FaCheck } from "react-icons/fa6";
import dynamic from "next/dynamic";

function AcceptCookiesContainerAll() {
  const [cookiesAccepted, setCookiesAccepted] = useLocalStorage(
    "d2c:cookies_accepted",
    false,
  );

  if (cookiesAccepted) return null;

  return (
    <div className={cx(c.cookies, threadFont.className)}>
      <p>
        Пользуясь сайтом и играя на серверах dotaclassic.ru Вы соглашаетесь на
        обработку персональных данных и хранение и передачу cookies.
        Ознакомиться можно{" "}
        <PageLink className={"link"} link={AppRouter.contact.link}>
          здесь.
        </PageLink>
      </p>

      <Button small onClick={() => setCookiesAccepted(true)}>
        <FaCheck />
        Согласен
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
