import React, { useEffect, useRef } from "react";
import c from "./Wiki.module.scss";
import { EmbedProps } from "@/components/EmbedProps";
import { useTranslation } from "react-i18next";

//ни в коем случае не ставить в конце слэш

interface WikiMsg {
  height: number | string;
}
export default function WikiEmbed() {
  const { t } = useTranslation();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  let CHILD_ORIGIN = process.env.WIKI_URL as string;
  if (CHILD_ORIGIN.endsWith("/")) {
    CHILD_ORIGIN = CHILD_ORIGIN.substring(0, CHILD_ORIGIN.length - 1);
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== CHILD_ORIGIN) return;

      const data = event.data as { type: string };
      if (
        data.type === "setHeight" &&
        typeof (event.data as WikiMsg).height === "number"
      ) {
        iframeRef.current!.style.height = `${(event.data as WikiMsg).height}px`;
      } else if (data.type === "scrollToTopDefault") {
        iframeRef.current!.scrollIntoView({ behavior: "auto", block: "start" });
      }
      // else if (data.type === 'scrollToTopSmooth') {
      //   setTimeout(() => {
      //     iframeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
      //   }, 25);
      // }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <EmbedProps
        title={t("items_wiki.title")}
        description={t("items_wiki.description")}
      />
      <iframe ref={iframeRef} src={CHILD_ORIGIN} className={c.iframe} />
    </>
  );
}
