import { Head, Html, Main, NextScript } from "next/document";
import { YandexMetrika, YaReklama } from "@/components";
import { GoogleTagManager } from "@/components/YandexMetrika/GoogleTagManager";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href={`/normalize.css`} />
        <link rel="stylesheet" href={`/minimap.css`} />
        {/*<link rel="icon" href="/favicon.ico" sizes="any" />*/}
        <link rel="icon" href="/logo3.png" sizes="any" />
        <YandexMetrika />
        <YaReklama />
        <GoogleTagManager />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
